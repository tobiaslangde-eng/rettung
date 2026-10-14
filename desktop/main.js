// Desktop-Hülle für Einsatz 112: lädt die Web-Version des Spiels in ein eigenes Fenster.
const { app, BrowserWindow, shell } = require('electron');
const path = require('node:path');

const isMac = process.platform === 'darwin';
const isWindows = process.platform === 'win32';

// Eigene dunkle Titelleiste: Die App zeichnet oben einen schmalen Streifen, in dem auf dem Mac
// die Ampel-Knöpfe und unter Windows die Fenster-Knöpfe liegen.
const titleBar = isMac
  ? { titleBarStyle: 'hiddenInset', trafficLightPosition: { x: 12, y: 9 } }
  : isWindows
    ? { titleBarStyle: 'hidden', titleBarOverlay: { color: '#14173A', symbolColor: '#FFFFFF', height: 32 } }
    : {};

function createWindow() {
  const win = new BrowserWindow({
    // Groß genug für die Seitenleiste und drei Spalten; kleiner gezogen wird es zur Handy-Ansicht.
    width: 1280,
    height: 820,
    minWidth: 380,
    minHeight: 640,
    title: 'Einsatz 112',
    backgroundColor: '#FFF3EE',
    ...titleBar,
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, sandbox: true },
  });
  win.removeMenu();
  win.loadFile(path.join(__dirname, 'app', 'index.html'));

  // Externe Links im Standardbrowser öffnen, nie im Spielfenster.
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (e) => e.preventDefault());
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
