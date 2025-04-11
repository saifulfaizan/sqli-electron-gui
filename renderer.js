
function runPowerExtreme() {
  const url = document.getElementById('extremeTarget').value.trim();
  const fullMode = document.getElementById('fullMode').checked;
  const mode = fullMode ? 'full' : 'auto';
  const logEl = document.getElementById('extremeLog');

  logEl.textContent = '[*] Memulakan Scanner Power Extreme dalam mode: ' + mode + '\n';

  if (!url) {
    logEl.textContent += '[!] Sila masukkan URL sasaran.\n';
    return;
  }

  window.electronAPI.runPowerExtreme(url, mode)
    .then(lines => {
      logEl.textContent += lines.join('\n');
    })
    .catch(err => {
      logEl.textContent += '\n[!] Ralat: ' + err.message;
    });
}
