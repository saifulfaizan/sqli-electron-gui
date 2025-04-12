// renderer.js (elecTron GUI logic)

function logTo(id, text) {
  const el = document.getElementById(id);
  el.textContent += `\n${text}`;
  el.scrollTop = el.scrollHeight;
}

function runLoginBypass() {
  const url = document.getElementById('loginUrl').value.trim();
  const logId = 'loginLog';
  if (!url) return logTo(logId, '[!] Sila masukkan URL login.');

  logTo(logId, `[🚀] Uji login bypass ke: ${url}`);

  window.electronAPI.runLoginBypass(url).then(res => {
    res.forEach(line => logTo(logId, line));
  }).catch(err => logTo(logId, `[❌] ${err.message}`));
}

function runPowerExtreme() {
  const url = document.getElementById('extremeTarget').value.trim();
  const fullMode = document.getElementById('fullMode').checked;
  const mode = fullMode ? 'full' : 'auto';
  const logId = 'extremeLog';

  if (!url) return logTo(logId, '[!] Masukkan URL laman utama.');
  logTo(logId, `[🚀] Mula scan mode: ${mode}`);

  window.electronAPI.runPowerExtreme(url, mode).then(logs => {
    logs.forEach(line => logTo(logId, line));
  }).catch(err => logTo(logId, `[❌] ${err.message}`));
}

function runTronAttack() {
  const url = document.getElementById('tronUrl').value.trim();
  const logId = 'tronLog';
  if (!url) return logTo(logId, '[!] Masukkan URL laman utama.');

  logTo(logId, `[⚡] Menjalankan TRON full injection ke: ${url}`);
  window.electronAPI.runTronFull(url).then(logs => {
    logs.forEach(line => logTo(logId, line));
  }).catch(err => logTo(logId, `[❌] ${err.message}`));
}
