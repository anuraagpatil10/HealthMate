import path from 'path';
import { app, ipcMain, session, protocol } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
const { registerIpcHandlers } = require('./api/ipcHandlers'); // Import IPC handlers
const { supabase } = require('./utils/supabaseClient'); // Import Supabase client

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

app.on('ready', () => {
  protocol.registerFileProtocol('app', (request, callback) => {
    const url = request.url.substring(6); // Remove 'app://' from the URL
    callback({ path: path.normalize(path.join(__dirname, url)) });
  });
});

(async () => {
  await app.whenReady();

  // Check for existing session cookie
  session.defaultSession.cookies.get({ name: 'supabaseSession' })
    .then((cookies) => {
      if (cookies.length > 0) {
        const userSession = JSON.parse(cookies[0].value);
        supabase.auth.setSession(userSession);
      }
    })
    .catch((error) => {
      console.error('Failed to retrieve cookies:', error);
    });

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    title: "HealthMate",
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    autoHideMenuBar: true,
  });
  mainWindow.maximize();

  if (isProd) {
    await mainWindow.loadURL('app://./');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/`);
    mainWindow.webContents.openDevTools();
  }

  // Register all IPC handlers
  registerIpcHandlers(mainWindow);
})();

app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`);
});
