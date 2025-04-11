// 📁 sqli-electron-gui/renderer.js
function runTest() {
  const url = document.getElementById('urlInput').value;
  const logBox = document.getElementById('log');

  if (!url) {
    logBox.value = '⚠️ Sila masukkan URL login terlebih dahulu.';
    return;
  }

  logBox.value = '🚀 Mula menjalankan SQLi test...\n';

  window.electronAPI.testSQLi(url).then(result => {
    logBox.value += result.join('\n');
  }).catch(err => {
    logBox.value += `❌ Ralat: ${err.message}`;
  });
}
