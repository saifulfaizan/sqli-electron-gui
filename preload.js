// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  runLoginBypass: (url) => ipcRenderer.invoke('run-login-bypass', url),
  runPowerExtreme: (url, mode) => ipcRenderer.invoke('run-power-extreme', { url, mode }),
  runTronFull: (url) => ipcRenderer.invoke('run-tron-full', url)
});