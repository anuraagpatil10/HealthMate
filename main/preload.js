const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('supabaseAPI', {
  // Expose the login function
  login: async (email, password) => await ipcRenderer.invoke('login', email, password),
  
  // Expose the signup function
  signup: async (email, password) => await ipcRenderer.invoke('signup', email, password),
  
  // Expose the fetchData function
  fetchData: async (table) => await ipcRenderer.invoke('fetch-data', table),

  // Expose a method to get cookies
  getCookies: async () => await ipcRenderer.invoke('get-cookies'),
});