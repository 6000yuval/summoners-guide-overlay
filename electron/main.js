
const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;
let overlayWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../public/favicon.ico'),
    title: 'League Coach Pro'
  });

  const startUrl = isDev 
    ? 'http://localhost:8080' 
    : `file://${path.join(__dirname, '../dist/index.html')}`;
  
  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createOverlayWindow() {
  overlayWindow = new BrowserWindow({
    width: 400,
    height: 600,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  const overlayUrl = isDev 
    ? 'http://localhost:8080#/overlay' 
    : `file://${path.join(__dirname, '../dist/index.html#/overlay')}`;
  
  overlayWindow.loadURL(overlayUrl);
  overlayWindow.hide();

  overlayWindow.on('closed', () => {
    overlayWindow = null;
  });
}

app.whenReady().then(() => {
  createMainWindow();
  createOverlayWindow();

  // Register global shortcuts
  globalShortcut.register('Alt+A', () => {
    if (overlayWindow) {
      if (overlayWindow.isVisible()) {
        overlayWindow.hide();
      } else {
        overlayWindow.show();
      }
    }
  });

  globalShortcut.register('Alt+Z', () => {
    if (mainWindow) {
      mainWindow.webContents.send('toggle-champion-select');
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// IPC handlers for League integration
ipcMain.handle('get-league-data', async () => {
  try {
    // Mock data for now - this would integrate with LCU service
    return { 
      connected: true, 
      gamePhase: 'InProgress',
      playerRole: 'mid',
      gameTime: 300
    };
  } catch (error) {
    console.error('Error getting league data:', error);
    return { connected: false, gamePhase: 'None' };
  }
});

ipcMain.handle('analyze-replay', async () => {
  try {
    // Mock replay analysis - this would trigger actual analysis
    return { 
      success: true, 
      analysisId: Date.now(),
      insights: ['Good CS at 10 minutes', 'Consider more vision control']
    };
  } catch (error) {
    console.error('Error analyzing replay:', error);
    return { success: false, error: error.message };
  }
});
