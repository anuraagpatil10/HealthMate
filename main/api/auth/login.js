const { api, storeSessionInCookies } = require('../../utils/httpClient');
const { debugLog, errorLog, infoLog } = require('../../utils/logger');

/**
 * Authenticates user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} Authentication result with user data and role or error
 */
async function login(email, password) {
  infoLog(`Login attempt initiated for email: ${email}`);
  
  // Input validation
  if (!email || !password) {
    errorLog('Missing required login parameters');
    return { error: 'Email and password are required' };
  }
  
  try {
    debugLog('Sending login request to backend API');
    
    // Make API request according to documentation
    const response = await api.post('/api/login', {
      email,
      password
    });

    if (response.data) {
      infoLog('Login successful');
      debugLog('Login response', response.data);
      
      // Validate session data according to API documentation
      if (!response.data.data || !response.data.data.session) {
        errorLog('Invalid session data received from API', response.data);
        return { error: 'Invalid session data received from server' };
      }
      
      // Store session data in cookies
      const sessionData = response.data.data.session;
      storeSessionInCookies(sessionData);

      infoLog(`User logged in successfully with role: ${response.data.role}`);
      return response.data; // Returns { data: { user: {...}, session: {...} }, role: 'patient' }
    } else {
      errorLog('Login response missing data');
      return { error: 'Invalid response from server' };
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    const statusCode = error.response?.status;
    
    errorLog(`Login error (${statusCode})`, errorMessage);
    
    // Provide more specific error messages based on status codes
    if (statusCode === 401) {
      return { error: 'Invalid email or password' };
    } else if (statusCode === 429) {
      return { error: 'Too many login attempts, please try again later' };
    }
    
    return { error: errorMessage || 'Authentication failed' };
  }
}

module.exports = { login }; 