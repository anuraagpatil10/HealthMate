import path from 'path';
import { app, ipcMain, session, protocol } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
const { registerIpcHandlers } = require('./api/ipcHandlers'); // Import IPC handlers
const { api } = require('./utils/httpClient'); // Import HTTP client

// Environment configuration
const isProd = process.env.NODE_ENV === 'production';
console.log(`Running in ${isProd ? 'production' : 'development'} mode`);

// App initialization
if (isProd) {
  serve({ directory: 'app' });
} else {
  const userDataPath = `${app.getPath('userData')} (development)`;
  console.log(`Setting user data path: ${userDataPath}`);
  app.setPath('userData', userDataPath);
}

// Register app protocol
app.on('ready', () => {
  protocol.registerFileProtocol('app', (request, callback) => {
    const url = request.url.substring(6); // Remove 'app://' from the URL
    const normalizedPath = path.normalize(path.join(__dirname, url));
    console.log(`Protocol request: ${request.url} -> ${normalizedPath}`);
    callback({ path: normalizedPath });
  });
});

/**
 * Main application initialization
 */
(async () => {
  try {
    console.log('Starting HealthMate application...');
  await app.whenReady();
    console.log('Electron app ready');

  // Check for existing session cookie
    try {
      const cookies = await session.defaultSession.cookies.get({ name: 'healthMateSession' });
      if (cookies.length > 0) {
        console.log('Found existing session cookie');
      } else {
        console.log('No session cookie found, user will need to log in');
      }
    } catch (error) {
      console.error('Failed to retrieve cookies:', error);
    }

    // Configure session
    session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
      // Add security headers
      details.requestHeaders['X-Client-Version'] = app.getVersion();
      callback({ requestHeaders: details.requestHeaders });
    });

    // Create main window
    console.log('Creating main window');
  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    title: "HealthMate",
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true,
    },
    autoHideMenuBar: true,
  });

  mainWindow.maximize();
    console.log('Main window created and maximized');

    // Load appropriate URL based on environment
  if (isProd) {
      console.log('Loading production URL: app://./');
    await mainWindow.loadURL('app://./');
  } else {
    const port = process.argv[2];
      const devUrl = `http://localhost:${port}/`;
      console.log(`Loading development URL: ${devUrl}`);
      await mainWindow.loadURL(devUrl);
    mainWindow.webContents.openDevTools();
      console.log('Developer tools opened');
  }

  // Register all IPC handlers
    console.log('Registering IPC handlers');
  registerIpcHandlers(mainWindow);
    console.log('IPC handlers registered successfully');
    
    // Handle uncaught exceptions in the main process
    process.on('uncaughtException', (error) => {
      console.error('Uncaught exception in main process:', error);
    });
  } catch (error) {
    console.error('Failed to initialize application:', error);
  }
})();

// Quit application when all windows are closed
app.on('window-all-closed', () => {
  console.log('All windows closed, quitting application');
  app.quit();
});

// Handle basic IPC messages
ipcMain.on('message', async (event, arg) => {
  console.log(`IPC message received: ${arg}`);
  event.reply('message', `${arg} World!`);
});
