const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('supabaseAPI', {
  // Existing methods...
  login: async (email, password) => await ipcRenderer.invoke('login', email, password),
  signup: async (email, password, fullName, phoneNumber, gender) => await ipcRenderer.invoke('signup', email, password, fullName, phoneNumber, gender),
  fetchData: async (table) => await ipcRenderer.invoke('fetch-data', table),
  getCookies: async () => await ipcRenderer.invoke('get-cookies'),
  logout: async () => await ipcRenderer.invoke('logout'),
  
  // New method for Google OAuth login
  loginWithGoogle: async () => await ipcRenderer.invoke('login-with-google'),
});