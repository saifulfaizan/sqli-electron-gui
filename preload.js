const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  runSQLi: (url) => ipcRenderer.send('run-sqli', url),
  runPowerExtreme: (url) => ipcRenderer.invoke('scanner:powerExtreme', url),
  onLog: (callback) => ipcRenderer.on('sqli-log', (_event, line) => callback(line))
});
