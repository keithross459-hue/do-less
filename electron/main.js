const { app, BrowserWindow, globalShortcut, ipcMain, screen, Tray, Menu } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;
let overlayWindow;
let tray;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#000000',
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const url = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../out/index.html')}`;
  mainWindow.loadURL(url);

  mainWindow.on('closed', () => (mainWindow = null));
}

function createOverlayWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  overlayWindow = new BrowserWindow({
    width: 400,
    height: 600,
    x: width - 420,
    y: 100,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: true,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const url = isDev ? 'http://localhost:3000/overlay' : `file://${path.join(__dirname, '../out/overlay.html')}`;
  overlayWindow.loadURL(url);
  
  // Set ignore mouse events if we want it to be a pure HUD, 
  // but for a "Jarvis" feel we want interaction.
  overlayWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
}

function createCommandPalette() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  
  const palette = new BrowserWindow({
    width: 700,
    height: 100, // Starts small, expands as you type
    center: true,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  palette.loadURL(isDev ? 'http://localhost:3000/command-palette' : `file://${path.join(__dirname, '../out/command-palette.html')}`);

  globalShortcut.register('CommandOrControl+Space', () => {
    if (palette.isVisible()) {
      palette.hide();
    } else {
      palette.show();
      palette.focus();
    }
  });

  return palette;
}

function createTray() {
  const iconPath = path.join(__dirname, 'assets/tray-icon.png');
  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show Dashboard', click: () => mainWindow.show() },
    { label: 'Toggle Overlay', click: () => {
        if (overlayWindow.isVisible()) overlayWindow.hide();
        else overlayWindow.show();
    }},
    { type: 'separator' },
    { label: 'Quit NexusOS', role: 'quit' }
  ]);
  tray.setToolTip('Nexus AI Operating System');
  tray.setContextMenu(contextMenu);
}

app.whenReady().then(() => {
  createMainWindow();
  createOverlayWindow();
  createCommandPalette();
  // createTray(); // Requires asset
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});

// IPC Communication
ipcMain.handle('get-system-info', async () => {
  return {
    platform: process.platform,
    arch: process.arch,
    memory: process.getSystemMemoryInfo(),
  };
});

ipcMain.on('execute-command', (event, command) => {
  console.log('Executing Native Command:', command);
  // Here we would trigger local scripts, terminal commands, etc.
});
