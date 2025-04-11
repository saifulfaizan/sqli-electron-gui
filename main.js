const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { handleSQLiLoginBypass } = require('./sqli');
const { handleFullSQLiAttack } = require('./sqli-full');
const { handleDatabaseExtraction } = require('./dbextract');
const { handlePowerExtremeScan } = require('./scanner-extreme');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadFile('index.html');
  // win.webContents.openDevTools(); // Uncomment to debug on load
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('scanner:powerExtreme', async (event, url) => {
  console.log('[MAIN] scanner:powerExtreme triggered');
  try {
    const result = await handlePowerExtremeScan(url);
    return result;
  } catch (err) {
    console.error('[MAIN] scanner-extreme error:', err);
    return [`[MAIN ERROR] ${err.message}`];
  }
});

ipcMain.handle('sqli:bypass', async (event, url) => {
  return await handleSQLiLoginBypass(url);
});

ipcMain.handle('sqli:full', async (event, url) => {
  return await handleFullSQLiAttack(url);
});

ipcMain.handle('db:extract', async (event, url) => {
  return await handleDatabaseExtraction(url);
});
