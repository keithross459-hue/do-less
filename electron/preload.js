const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('nexusNative', {
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  executeCommand: (cmd) => ipcRenderer.send('execute-command', cmd),
  onCommandResponse: (callback) => ipcRenderer.on('command-response', (event, ...args) => callback(...args)),
  
  // Search local file system (Mock for now, would use fs/glob)
  searchLocal: (query) => ipcRenderer.invoke('search-local', query),
  
  // Capture screen
  captureScreen: () => ipcRenderer.invoke('capture-screen'),
  
  // Clipboard
  readClipboard: () => ipcRenderer.invoke('read-clipboard'),
  writeClipboard: (text) => ipcRenderer.send('write-clipboard', text),
});
