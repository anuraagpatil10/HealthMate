// electron/api/ipcHandlers.js
const { ipcMain, session } = require('electron');
const { login } = require('./login');
const { signup } = require('./signup');
const { fetchData } = require('./fetchdata');
const { logout } = require('../utils/supabaseClient');
const { loginWithGoogle } = require('./googleOAuth');
const { getUserRole } = require('./getUserRole');
const { getPatientAppointments } = require('./patient/getPatientAppointments'); // Import the getAppointments function
const { saveAppointment } = require('./saveAppointment'); // Import the saveAppointment function

function registerIpcHandlers(mainWindow) {
  ipcMain.handle('login', async (event, email, password) => {
    return await login(email, password);
  });

  ipcMain.handle('signup', async (event, email, password, fullName, phoneNumber, gender, role) => {
    return await signup(email, password, fullName, phoneNumber, gender, role);
  });

  ipcMain.handle('fetch-data', async (event, table) => {
    return await fetchData(table);
  });

  ipcMain.handle('get-cookies', async () => {
    return await session.defaultSession.cookies.get({});
  });

  ipcMain.handle('logout', async () => {
    try {
      await logout();
      return { success: true };
    } catch (error) {
      return { error: error.message };
    }
  });

  ipcMain.handle('login-with-google', async () => {
    try {
      const data = await loginWithGoogle(mainWindow);
      return { data };
    } catch (error) {
      return { error: error.message };
    }
  });

  ipcMain.handle('get-user-role', async () => {
    return await getUserRole();
  });

  ipcMain.handle('get-patient-appointments', async (event, patientId) => {
    return await getPatientAppointments(patientId); // Handle fetching appointments
  });  
  ipcMain.handle('save-appointment', async (event, appointment) => {
    return await saveAppointment(appointment); // Handle saving new appointment
  });
}

module.exports = { registerIpcHandlers };
