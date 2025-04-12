// scanner/scanner-core.js
const testUnionBased = require('./engine/engine-union');
const testErrorBased = require('./engine/engine-error');
// future: const testTimeBased = require('./engine/engine-time');

async function runFullInjection(url, method = 'POST', headers = {}, fields = []) {
  const allResults = [];

  const engines = [
    { name: 'UNION-based', run: testUnionBased },
    { name: 'Error-based', run: testErrorBased }
    // { name: 'Time-based', run: testTimeBased }
  ];

  for (const engine of engines) {
    console.log(`\n⚙️  Running ${engine.name} test...`);
    const result = await engine.run(url, method, headers, fields);
    result.forEach(r => {
      console.log(`${r.vuln ? '✔️' : '⚠️'} ${r.engine.toUpperCase()} ${r.field} = ${r.payload}`);
    });
    allResults.push(...result);
  }

  return allResults;
}

module.exports = runFullInjection;
