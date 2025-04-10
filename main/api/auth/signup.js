const { api } = require('../../utils/httpClient');
const { debugLog, errorLog, infoLog, warnLog } = require('../../utils/logger');

/**
 * Registers a new user account
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} fullName - User's full name
 * @param {string} phoneNumber - User's phone number
 * @param {string} gender - User's gender
 * @param {string} role - User's role (patient/doctor)
 * @returns {Promise<Object>} Registration result or error
 */
async function signup(email, password, fullName, phoneNumber, gender, role) {
  infoLog(`Signup attempt initiated for ${role} account`);
  
  // Input validation according to API documentation
  if (!email || !password || !fullName || !role) {
    errorLog('Missing required signup parameters', { email, fullName, role });
    return { error: 'Email, password, full name, and role are required' };
  }
  
  if (!['patient', 'doctor'].includes(role.toLowerCase())) {
    errorLog(`Invalid role provided: ${role}`);
    return { error: 'Role must be either "patient" or "doctor"' };
  }
  
  debugLog('Signup parameters validation successful', { email, role });

  try {
    debugLog('Sending signup request to backend API');
    
    // Make API request according to documentation
    const response = await api.post('/api/signup', {
      email,
      password,
      fullName,
      phoneNumber,
      gender,
      role
    });

    if (response.data && response.data.data) {
      infoLog(`User registered successfully`, { email, role });
      debugLog('Signup response', response.data);
      return { data: response.data.data };
    } else {
      errorLog('Signup response missing data', response.data);
      return { error: 'Invalid response from server' };
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    const statusCode = error.response?.status;
    
    errorLog(`Signup error (${statusCode})`, errorMessage);
    
    // Provide more specific error messages based on status codes
    if (statusCode === 409) {
      return { error: 'This email is already registered' };
    } else if (statusCode === 400) {
      return { error: 'Invalid signup information. Please check your details.' };
    }
    
    return { error: errorMessage || 'Registration failed' };
  }
}

export{ signup }; 