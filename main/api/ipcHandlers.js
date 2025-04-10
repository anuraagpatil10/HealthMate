// electron/api/ipcHandlers.js
const { ipcMain, session } = require('electron');
const { debugLog, errorLog, infoLog, warnLog } = require('../utils/logger');
const { logout } = require('../utils/httpClient');

// Authentication API handlers
const { login } = require('./auth/login');
const { signup } = require('./auth/signup');
const { getUserRole } = require('./auth/getUserRole');
const { refreshToken } = require('./auth/refreshToken');
const { loginWithGoogle } = require('./auth/googleOAuth');

// Profile API handlers
const { getProfile } = require('./profile/getProfile');

// Doctor API handlers
const { getDoctors } = require('./doctor/getDoctors');
const { getDoctorPatients } = require('./doctor/getPatients');
const { getDoctorAppointments } = require('./doctor/getDoctorAppointments');

// Patient API handlers
const { getPatientAppointments } = require('./patient/getPatientAppointments');
const { saveAppointment } = require('./patient/saveAppointment');

// Import other API handlers as needed based on api.md

/**
 * Registers all IPC handlers for the application
 * @param {Object} mainWindow - The main application window
 */
function registerIpcHandlers(mainWindow) {
  if (!mainWindow) {
    errorLog('Main window is required to register IPC handlers');
    throw new Error('Main window is required');
  }

  infoLog('Registering IPC handlers...');

  // Authentication handlers
  registerAuthHandlers(mainWindow);
  
  // Profile handlers
  registerProfileHandlers();

  // Doctor-Patient Connection handlers
  registerDoctorPatientHandlers();
  
  // Appointment handlers
  registerAppointmentHandlers();

  // Prescription handlers (to be implemented)
  // registerPrescriptionHandlers();

  // Lab Report handlers (to be implemented)
  // registerLabReportHandlers();

  // Chat handlers (to be implemented)
  // registerChatHandlers();

  infoLog('All IPC handlers registered successfully');
}

/**
 * Registers authentication-related IPC handlers
 * @param {Object} mainWindow - The main application window
 */
function registerAuthHandlers(mainWindow) {
  // Login handler
  ipcMain.handle('login', async (event, email, password) => {
    debugLog(`Login request received for email: ${email}`);
    try {
      const result = await login(email, password);
      return result;
    } catch (error) {
      errorLog('Login handler error', error);
      return { error: error.message || 'Authentication failed' };
    }
  });

  // Signup handler
  ipcMain.handle('signup', async (event, email, password, fullName, phoneNumber, gender, role) => {
    debugLog(`Signup request received for email: ${email}, role: ${role}`);
    try {
      const result = await signup(email, password, fullName, phoneNumber, gender, role);
      return result;
    } catch (error) {
      errorLog('Signup handler error', error);
      return { error: error.message || 'Registration failed' };
    }
  });

  // Google OAuth Login handler
  ipcMain.handle('login-with-google', async () => {
    debugLog('Google login request received');
    try {
      const data = await loginWithGoogle(mainWindow);
      infoLog('Google login successful');
      return { data };
    } catch (error) {
      errorLog('Google login handler error', error);
      return { error: error.message || 'Google authentication failed' };
    }
  });

  // Logout handler
  ipcMain.handle('logout', async () => {
    debugLog('Logout request received');
    try {
      await logout();
      infoLog('Logout successful');
      return { success: true };
    } catch (error) {
      errorLog('Logout handler error', error);
      return { error: error.message || 'Logout failed' };
    }
  });

  // Get cookies handler
  ipcMain.handle('get-cookies', async () => {
    debugLog('Get cookies request received');
    try {
      const cookies = await session.defaultSession.cookies.get({});
      return cookies;
    } catch (error) {
      errorLog('Get cookies handler error', error);
      return [];
    }
  });

  // Refresh token handler
  ipcMain.handle('refresh-token', async () => {
    debugLog('Refresh token request received');
    try {
      const result = await refreshToken();
      return result;
    } catch (error) {
      errorLog('Refresh token handler error', error);
      return { error: error.message || 'Failed to refresh token' };
    }
  });

  // Get user role handler
  ipcMain.handle('get-user-role', async () => {
    debugLog('Get user role request received');
    try {
      const result = await getUserRole();
      return result;
    } catch (error) {
      errorLog('Get user role handler error', error);
      return { error: error.message || 'Failed to get user role' };
    }
  });
}

/**
 * Registers profile-related IPC handlers
 */
function registerProfileHandlers() {
  // Get profile handler
  ipcMain.handle('get-profile', async () => {
    debugLog('Get profile request received');
    try {
      const result = await getProfile();
      return result;
    } catch (error) {
      errorLog('Get profile handler error', error);
      return { error: error.message || 'Failed to get profile' };
    }
  });
}

/**
 * Registers doctor-patient connection IPC handlers
 */
function registerDoctorPatientHandlers() {
  // Get doctors handler
  ipcMain.handle('get-doctors', async () => {
    debugLog('Get doctors request received');
    try {
      const result = await getDoctors();
      return result;
    } catch (error) {
      errorLog('Get doctors handler error', error);
      return { error: error.message || 'Failed to fetch doctors', data: [] };
    }
  });

  // Get doctor's patients handler
  ipcMain.handle('get-doctor-patients', async () => {
    debugLog('Get doctor patients request received');
    try {
      const result = await getDoctorPatients();
      return result;
    } catch (error) {
      errorLog('Get doctor patients handler error', error);
      return { error: error.message || 'Failed to fetch patients', data: [] };
    }
  });
}

/**
 * Registers appointment-related IPC handlers
 */
function registerAppointmentHandlers() {
  // Get patient appointments handler
  ipcMain.handle('get-patient-appointments', async (event, patientId) => {
    debugLog(`Get appointments request received for patient: ${patientId}`);
    try {
      const result = await getPatientAppointments(patientId);
      return result;
    } catch (error) {
      errorLog('Get patient appointments handler error', error);
      return { error: error.message || 'Failed to fetch appointments', data: [] };
    }
  });

  // Get doctor appointments handler
  ipcMain.handle('get-doctor-appointments', async (event, doctorId) => {
    debugLog(`Get appointments request received for doctor: ${doctorId}`);
    try {
      const result = await getDoctorAppointments(doctorId);
      return result;
    } catch (error) {
      errorLog('Get doctor appointments handler error', error);
      return { error: error.message || 'Failed to fetch appointments', data: [] };
    }
  });

  // Save appointment handler
  ipcMain.handle('save-appointment', async (event, appointment) => {
    debugLog('Save appointment request received');
    try {
      if (!appointment) {
        throw new Error('Appointment data is required');
      }
      const result = await saveAppointment(appointment);
      return result;
    } catch (error) {
      errorLog('Save appointment handler error', error);
      return { error: error.message || 'Failed to save appointment' };
    }
  });
}

// Additional handlers for prescription, lab reports, and chat can be implemented here
// based on the API documentation (api.md)

module.exports = { registerIpcHandlers };
