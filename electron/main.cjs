
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

  // Load the app
  if (isDev) {
    const devPort = process.env.DEV_PORT || 8080;
    mainWindow.loadURL(`http://localhost:${devPort}`);
    // Only open dev tools if explicitly requested
    if (process.env.ELECTRON_DEBUG) {
      mainWindow.webContents.openDevTools();
    }
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Fix white screen issue by waiting for ready-to-show
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Debug logging for production builds
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });

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

  // Load the overlay route
  if (isDev) {
    const devPort = process.env.DEV_PORT || 8080;
    overlayWindow.loadURL(`http://localhost:${devPort}#/overlay`);
  } else {
    overlayWindow.loadFile(path.join(__dirname, '../dist/index.html'), { hash: '/overlay' });
  }
  
  overlayWindow.hide();

  overlayWindow.on('closed', () => {
    overlayWindow = null;
  });
}

app.whenReady().then(() => {
  createMainWindow();
  createOverlayWindow();

  // Register unified Alt+A hotkey for overlay and champion tips
  globalShortcut.register('Alt+A', () => {
    if (overlayWindow) {
      if (overlayWindow.isVisible()) {
        overlayWindow.hide();
      } else {
        overlayWindow.show();
      }
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
      gamePhase: 'ChampSelect', // Can be 'ChampSelect', 'InProgress', 'None'
      playerRole: 'mid',
      gameTime: 300
    };
  } catch (error) {
    console.error('Error getting league data:', error);
    return { connected: false, gamePhase: 'None' };
  }
});

ipcMain.handle('read-lockfile', async () => {
  try {
    const fs = require('fs');
    const os = require('os');
    
    let lockfilePath;
    if (process.platform === 'win32') {
      lockfilePath = path.join('C:', 'Riot Games', 'League of Legends', 'lockfile');
    } else if (process.platform === 'darwin') {
      lockfilePath = '/Applications/League of Legends.app/Contents/LoL/lockfile';
    } else {
      return null;
    }
    
    if (fs.existsSync(lockfilePath)) {
      const lockfileContent = fs.readFileSync(lockfilePath, 'utf8');
      const [name, pid, port, password, protocol] = lockfileContent.split(':');
      return { port: parseInt(port), password, protocol };
    }
    
    return null;
  } catch (error) {
    console.error('Error reading lockfile:', error);
    return null;
  }
});

ipcMain.handle('test-lcu-connection', async (event, credentials) => {
  try {
    if (!credentials) return false;
    
    const https = require('https');
    const agent = new https.Agent({
      rejectUnauthorized: false
    });
    
    const response = await fetch(
      `${credentials.protocol}://riot:${credentials.password}@127.0.0.1:${credentials.port}/lol-gameflow/v1/gameflow-phase`,
      {
        method: 'GET',
        agent,
        headers: {
          'Authorization': `Basic ${Buffer.from(`riot:${credentials.password}`).toString('base64')}`,
        },
      }
    );
    
    return response.ok;
  } catch (error) {
    console.error('LCU connection test failed:', error);
    return false;
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
