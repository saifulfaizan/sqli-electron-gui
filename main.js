// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const discoverApis = require('./scanner/api-discover');
const injectToApi = require('./scanner/api-auto-sqli');
const runFullInjection = require('./scanner/scanner-core');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// 🔐 IPC logic
ipcMain.handle('run-login-bypass', async (event, url) => {
  return [`[!] Login bypass belum tersedia untuk URL ini: ${url}`];
});

ipcMain.handle('run-power-extreme', async (event, { url, mode }) => {
  const logs = [];
  const apis = await discoverApis(url);
  if (apis.length === 0) {
    logs.push('❌ Tiada endpoint API dikesan.');
    return logs;
  }
  logs.push(`📡 Jumpa endpoint: ${apis.join(', ')}`);
  const result = await injectToApi(url, apis);
  result.forEach(r => {
    const tag = r.vuln ? '✔️ VULN' : '⚠️';
    logs.push(`${tag} → ${r.url} (${r.field}) [${r.status}]`);
  });
  return logs;
});

ipcMain.handle('run-tron-full', async (event, url) => {
  const logs = [`🚀 TRON Full Scan bermula ke ${url}`];
  let apis = await discoverApis(url);

  if (apis.length === 0) {
    logs.push('❗ Tiada endpoint API dijumpai. Mencuba inject terus ke root URL...');
    apis = [url];
  } else {
    logs.push('📡 Ditemui endpoint:');
    apis.forEach(a => logs.push(' - ' + a));
  }

  const fields = ['email', 'username', 'password', 'search', 'query', 'user', 'id'];
  const allResults = [];

  for (const api of apis) {
    const fullUrl = api.startsWith('http') ? api : new URL(api, url).toString();
    logs.push(`\n⚙️ Menguji: ${fullUrl}`);
    const result = await runFullInjection(fullUrl, 'POST', {}, fields);
    result.forEach(r => {
      const tag = r.evidence ? '✔️' : '⚠️';
      logs.push(`${tag} [${r.engine}] ${r.field} = ${r.payload}`);
      allResults.push(r);
    });
  }

  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const out = path.join(__dirname, 'output', `tron-core-${ts}.json`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(allResults, null, 2));
  logs.push(`\n💾 Semua hasil disimpan ke: ${out}`);
  return logs;
});
