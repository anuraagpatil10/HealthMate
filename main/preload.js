const { contextBridge, ipcRenderer } = require('electron');

/**
 * HealthMate API functions exposed to the renderer process
 * These functions proxy IPC calls to the main process
 */
contextBridge.exposeInMainWorld('healthMateAPI', {
  // Authentication APIs
  /**
   * Authenticates a user with email and password
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<Object>} Authentication response with user data and token
   */
  login: (email, password) => {
    if (!email || !password) {
      console.error('[ERROR] Missing login parameters');
      return Promise.reject(new Error('Email and password are required'));
    }
    return ipcRenderer.invoke('login', email, password);
  },
  
  /**
   * Registers a new user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @param {string} fullName - User's full name
   * @param {string} phoneNumber - User's phone number
   * @param {string} gender - User's gender
   * @param {string} role - User's role (patient/doctor)
   * @returns {Promise<Object>} Registration response
   */
  signup: (email, password, fullName, phoneNumber, gender, role) => {
    if (!email || !password || !fullName || !role) {
      console.error('[ERROR] Missing signup parameters');
      return Promise.reject(new Error('Required fields are missing'));
    }
    return ipcRenderer.invoke('signup', email, password, fullName, phoneNumber, gender, role);
  },
  
  /**
   * Refreshes the access token using the refresh token
   * @returns {Promise<Object>} New tokens
   */
  refreshToken: () => ipcRenderer.invoke('refresh-token'),
  
  /**
   * Retrieves the current user's role
   * @returns {Promise<Object>} User role information
   */
  getUserRole: () => ipcRenderer.invoke('get-user-role'),
  
  /**
   * Logs out the current user
   * @returns {Promise<Object>} Logout result
   */
  logout: () => ipcRenderer.invoke('logout'),
  
  /**
   * Initiates Google OAuth login flow
   * @returns {Promise<Object>} Authentication response
   */
  loginWithGoogle: () => ipcRenderer.invoke('login-with-google'),

  // Profile APIs
  /**
   * Fetches authenticated user's profile
   * @returns {Promise<Object>} User profile data
   */
  getProfile: () => ipcRenderer.invoke('get-profile'),

  // Doctor-Patient Connection APIs
  /**
   * Retrieves list of all doctors
   * @returns {Promise<Object>} List of doctors
   */
  getDoctors: () => ipcRenderer.invoke('get-doctors'),
  
  /**
   * Retrieves patients who booked with the doctor
   * @returns {Promise<Object>} List of patients
   */
  getDoctorPatients: () => ipcRenderer.invoke('get-doctor-patients'),

  // Appointment APIs
  /**
   * Retrieves appointments for a patient
   * @param {string} patientId - ID of the patient
   * @returns {Promise<Object>} List of appointments
   */
  getPatientAppointments: (patientId) => {
    if (!patientId) {
      console.error('[ERROR] Patient ID is required');
      return Promise.reject(new Error('Patient ID is required'));
    }
    return ipcRenderer.invoke('get-patient-appointments', patientId);
  },
  
  /**
   * Retrieves appointments for a doctor
   * @param {string} doctorId - ID of the doctor
   * @returns {Promise<Object>} List of appointments
   */
  getDoctorAppointments: (doctorId) => {
    if (!doctorId) {
      console.error('[ERROR] Doctor ID is required');
      return Promise.reject(new Error('Doctor ID is required'));
    }
    return ipcRenderer.invoke('get-doctor-appointments', doctorId);
  },
  
  /**
   * Saves a new appointment
   * @param {Object} appointment - Appointment data
   * @returns {Promise<Object>} Save result
   */
  saveAppointment: (appointment) => {
    if (!appointment || !appointment.doctor_id || !appointment.patient_id) {
      console.error('[ERROR] Invalid appointment data');
      return Promise.reject(new Error('Invalid appointment data'));
    }
    return ipcRenderer.invoke('save-appointment', appointment);
  },

  // Prescription APIs - to be implemented

  // Lab Reports APIs - to be implemented

  // Chat APIs - to be implemented

  // Utility APIs
  /**
   * Retrieves cookies from the session
   * @returns {Promise<Array>} Array of cookies
   */
  getCookies: () => ipcRenderer.invoke('get-cookies')
});