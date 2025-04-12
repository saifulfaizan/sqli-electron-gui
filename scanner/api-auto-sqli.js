// scanner/api-auto-sqli.js

const axios = require('axios');
const payloads = require('./payloads.json');

async function injectToApi(baseUrl, endpoints) {
  const resultLog = [];
  const fields = payloads.commonFields;
  const combos = [...payloads.sqli, ...payloads.smart];

  for (const ep of endpoints) {
    const fullUrl = ep.startsWith('http') ? ep : new URL(ep, baseUrl).toString();
    console.log(`\n🔍 Mula inject: ${fullUrl}`);

    for (const field of fields) {
      for (const payload of combos) {
        const data = { [field]: payload };

        try {
          const res = await axios.post(fullUrl, data, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 7000
          });

          const size = JSON.stringify(res.data).length;
          const isVuln = res.status >= 200 && res.status < 300 && size > 100;

          resultLog.push({ url: fullUrl, field, payload, status: res.status, length: size, vuln: isVuln });
          if (isVuln) {
            console.log(`\x1b[32m✔️ POSSIBLE ${field} → ${payload} [${res.status}]\x1b[0m`);
          } else {
            console.log(`⚠️  ${field} → ${payload} [${res.status}]`);
          }
        } catch (err) {
          const msg = err.response ? err.response.status : err.code;
          console.log(`\x1b[31m❌ ${field} → ${payload} → ${msg}\x1b[0m`);
        }
      }
    }
  }

  return resultLog;
}

module.exports = injectToApi;
