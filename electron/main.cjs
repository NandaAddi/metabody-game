const { app, BrowserWindow, shell, session } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    minWidth: 1024,
    minHeight: 600,
    title: 'METABODY — Game Fisiologi & Homeostasis Tubuh Manusia',
    autoHideMenuBar: true,
    backgroundColor: '#050b14',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      // Izinkan WebView / iframe interaktif untuk 3D Sketchfab dan simulasi lokal
      webviewTag: true
    }
  });

  // Handle external link clicks to open in default browser if needed
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://sketchfab.com') || url.startsWith('http://') || url.startsWith('https://')) {
      // Izinkan navigasi popup/iframe sketchfab internal
      return { action: 'allow' };
    }
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Load production build or dev server
  const isDev = !app.isPackaged && process.env.NODE_ENV === 'development';
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Izinkan permission media/webgl untuk sketchfab 3D
  session.defaultSession.setPermissionCheckHandler((webContents, permission) => {
    return true;
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App lifecycle
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
