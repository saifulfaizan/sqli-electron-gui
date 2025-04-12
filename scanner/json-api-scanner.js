// 📁 scanner/json-api-scanner.js — Engine Inject JSON API elecTron-Scanner-X
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const payloads = require('./payloads.json');

function isJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

async function runJSONApiScan(targetUrl, mode = 'basic') {
  const results = [];
  const tested = new Set();
  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'elecTron-Scanner-X/1.0'
  };

  const payloadSet = mode === 'smart' ? [...payloads.sqli, ...payloads.smart] : payloads.sqli;

  console.log(`🔍 Mula scan ke ${targetUrl} dalam mode: ${mode}`);

  for (let key of payloads.commonFields) {
    for (let inj of payloadSet) {
      const body = {};
      body[key] = inj;

      const id = `${key}:${inj}`;
      if (tested.has(id)) continue;
      tested.add(id);

      try {
        const res = await axios.post(targetUrl, JSON.stringify(body), { headers, timeout: 10000 });
        const len = JSON.stringify(res.data).length;

        const entry = {
          field: key,
          payload: inj,
          status: res.status,
          length: len,
          indicator: isJSON(res.data) ? 'JSON' : 'HTML/Text',
          success: len > 100 && !String(res.data).includes('error')
        };

        results.push(entry);
        console.log(`✅ ${key} ← "${inj}" → ${len} bytes`);

      } catch (err) {
        results.push({ field: key, payload: inj, error: err.message });
        console.log(`❌ ${key} ← "${inj}" → Ralat: ${err.code || err.message}`);
      }
    }
  }

  return results;
}

module.exports = { runJSONApiScan };
