// 📁 sqli-electron-gui/preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  testSQLi: (url) => ipcRenderer.invoke('sqli:test', url)
});
