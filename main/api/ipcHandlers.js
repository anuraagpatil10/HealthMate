// electron/api/ipcHandlers.js
const { ipcMain } = require('electron');
const { login } = require('./login');
const { signup } = require('./signup');
const { fetchData } = require('./fetchdata');

function registerIpcHandlers() {
  // Login handler
  ipcMain.handle('login', async (_, email, password) => {
    try {
      return { data: await login(email, password) };
    } catch (error) {
      return { error: error.message };
    }
  });

  // Signup handler
  ipcMain.handle('signup', async (_, email, password) => {
    try {
      return { data: await signup(email, password) };
    } catch (error) {
      return { error: error.message };
    }
  });

  // Fetch data handler
  ipcMain.handle('fetch-data', async (_, table) => {
    try {
      return { data: await fetchData(table) };
    } catch (error) {
      return { error: error.message };
    }
  });
}

module.exports = { registerIpcHandlers };
