const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('supabaseAPI', {
  login: (email, password) => ipcRenderer.invoke('login', email, password),
  signup: (email, password, fullName, phoneNumber, gender, role) => ipcRenderer.invoke('signup', email, password, fullName, phoneNumber, gender, role),
  fetchData: (table) => ipcRenderer.invoke('fetch-data', table),
  getCookies: () => ipcRenderer.invoke('get-cookies'),
  logout: () => ipcRenderer.invoke('logout'),
  loginWithGoogle: () => ipcRenderer.invoke('login-with-google'),
  getUserRole: () => ipcRenderer.invoke('get-user-role'),
  getPatientAppointments: (patientId) => ipcRenderer.invoke('get-patient-appointments', patientId), // Expose the getAppointments handler
  saveAppointment: (appointment) => ipcRenderer.invoke('save-appointment', appointment) // Expose the saveAppointment handler
});