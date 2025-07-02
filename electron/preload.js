
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getLeagueData: () => ipcRenderer.invoke('get-league-data'),
  analyzeReplay: () => ipcRenderer.invoke('analyze-replay'),
  readLockfile: () => ipcRenderer.invoke('read-lockfile'),
  testLCUConnection: (credentials) => ipcRenderer.invoke('test-lcu-connection', credentials),
  onToggleChampionSelect: (callback) => ipcRenderer.on('toggle-champion-select', callback),
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});
