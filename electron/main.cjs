const { app, BrowserWindow, shell, session, net, protocol } = require('electron');
const path = require('path');
const { pathToFileURL } = require('url');

// WAJIB dipanggil sebelum app ready:
// stream: true sangat penting agar tag <video> dan <audio> Chromium mendukung response streaming (Range 206)
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      stream: true,
      corsEnabled: true
    }
  }
]);

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
    // Gunakan custom protocol 'app://' agar semua path root-relative
    // (/simeta/, /branding/, /videos/ dll.) bisa di-resolve ke dist/ dengan benar
    mainWindow.loadURL('app://localhost/index.html');
  }

  // Izinkan permission media/webgl untuk sketchfab 3D
  session.defaultSession.setPermissionCheckHandler(() => {
    return true;
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App lifecycle
app.whenReady().then(() => {
  const fs = require('fs');
  const { Readable } = require('stream');

  // Path ke dist/ di dalam .asar (untuk aset non-video seperti HTML, JS, CSS, gambar)
  const distPath = path.join(__dirname, '../dist');

  // Helper untuk mencari lokasi file video yang sesungguhnya di disk
  function resolveVideoPath(rawUrlPath) {
    const decoded = decodeURIComponent(rawUrlPath);
    const fileName = path.basename(decoded);

    const candidates = [
      // 1. Packaged: resources/app.asar.unpacked/dist/videos (portable maupun NSIS)
      path.join(process.resourcesPath, 'app.asar.unpacked', 'dist', 'videos', fileName),
      // 2. Relative terhadap asar
      path.join(app.getAppPath(), '..', 'app.asar.unpacked', 'dist', 'videos', fileName),
      // 3. Fallback di direktori dist
      path.join(__dirname, '../dist/videos', fileName),
      // 4. Fallback dev / public
      path.join(__dirname, '../public/videos', fileName),
      path.join(app.getAppPath(), 'public', 'videos', fileName),
      path.join(process.cwd(), 'dist', 'videos', fileName),
      path.join(process.cwd(), 'public', 'videos', fileName)
    ];

    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }
    return null;
  }

  // Daftarkan custom protocol 'app://' dengan dukungan Range request untuk video streaming
  protocol.handle('app', (request) => {
    const url = new URL(request.url);
    const urlPath = url.pathname;

    // File video di-stream dengan HTTP 206 Partial Content
    const isVideo = urlPath.toLowerCase().includes('/videos/') || urlPath.toLowerCase().endsWith('.mp4');

    if (isVideo) {
      const videoFilePath = resolveVideoPath(urlPath);

      if (!videoFilePath) {
        console.error('[METABODY Protocol] Video not found:', urlPath);
        return new Response('Video not found', { status: 404 });
      }

      const stat = fs.statSync(videoFilePath);
      const fileSize = stat.size;
      const rangeHeader = request.headers.get('range');

      if (rangeHeader) {
        // Standard RFC 7233 byte-range parsing: "bytes=start-end"
        const match = rangeHeader.match(/bytes=(\d*)-(\d*)/);
        let start = 0;
        let end = fileSize - 1;

        if (match) {
          if (match[1] && match[2]) {
            start = parseInt(match[1], 10);
            end = parseInt(match[2], 10);
          } else if (match[1]) {
            start = parseInt(match[1], 10);
            end = fileSize - 1;
          } else if (match[2]) {
            start = Math.max(0, fileSize - parseInt(match[2], 10));
            end = fileSize - 1;
          }
        }

        if (isNaN(start) || isNaN(end) || start >= fileSize || end >= fileSize || start > end) {
          return new Response(null, {
            status: 416,
            headers: {
              'Content-Range': `bytes */${fileSize}`,
            }
          });
        }

        const chunkSize = end - start + 1;
        const nodeStream = fs.createReadStream(videoFilePath, { start, end });
        const webStream = Readable.toWeb(nodeStream);

        return new Response(webStream, {
          status: 206,
          headers: {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': String(chunkSize),
            'Content-Type': 'video/mp4',
          }
        });
      } else {
        // Full video request
        const nodeStream = fs.createReadStream(videoFilePath);
        const webStream = Readable.toWeb(nodeStream);

        return new Response(webStream, {
          status: 200,
          headers: {
            'Content-Length': String(fileSize),
            'Content-Type': 'video/mp4',
            'Accept-Ranges': 'bytes',
          }
        });
      }
    }

    // Aset non-video (HTML, JS, CSS, SVG, PNG, dll.) — disajikan via Chromium fetch
    const decodedUrlPath = decodeURIComponent(urlPath);
    const cleanPath = decodedUrlPath.startsWith('/') ? decodedUrlPath.slice(1) : decodedUrlPath;
    const filePath = path.join(distPath, cleanPath || 'index.html');
    return net.fetch(pathToFileURL(filePath).toString());
  });

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
