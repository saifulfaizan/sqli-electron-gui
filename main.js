// 📁 sqli-electron-gui/main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { handleSQLiTest } = require('./sqli');

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.handle('sqli:test', async (event, url) => {
    return await handleSQLiTest(url);
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
