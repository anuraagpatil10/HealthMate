const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('supabaseAPI', {
  // Expose the login function
  login: async (email, password) => await ipcRenderer.invoke('login', email, password),
  
  // Expose the signup function
  signup: async (email, password, fullName, phoneNumber, gender) => await ipcRenderer.invoke('signup', email, password, fullName, phoneNumber, gender),
  
  // Expose the fetchData function
  fetchData: async (table) => await ipcRenderer.invoke('fetch-data', table),

  // Expose a method to get cookies
  getCookies: async () => await ipcRenderer.invoke('get-cookies'),

  // Expose the logout function
  logout: async () => await ipcRenderer.invoke('logout'),
});