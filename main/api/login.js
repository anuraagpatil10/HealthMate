// electron/api/login.js
const { api, storeSessionInCookies } = require('../utils/httpClient');

/**
 * Authenticates user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} Authentication result with user data and role or error
 */
async function login(email, password) {
  console.log(`Login attempt for email: ${email}`);
  
  if (!email || !password) {
    console.error('Missing required login parameters');
    return { error: 'Email and password are required' };
  }

  try {
    console.log('Sending login request to backend API...');
    const response = await api.post('/api/login', {
      email,
      password
    });

    if (response.data) {
      console.log('Login successful, storing session data');
      
      // Validate session data
      if (!response.data.data || !response.data.data.session) {
        console.error('Invalid session data received from API');
        return { error: 'Invalid session data received from server' };
  }

      // Store session data in cookies
      const sessionData = response.data.data.session;
      storeSessionInCookies(sessionData);

      console.log(`User logged in successfully with role: ${response.data.role}`);
      return response.data; // Returns { data: { user: {...}, session: {...} }, role: 'patient' }
    } else {
      console.error('Login response missing data');
      return { error: 'Invalid response from server' };
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Login Error:', errorMessage, error.response?.status);
    
    // Provide more specific error messages based on status codes
    if (error.response?.status === 401) {
      return { error: 'Invalid email or password' };
    } else if (error.response?.status === 429) {
      return { error: 'Too many login attempts, please try again later' };
  }

    return { error: errorMessage || 'Authentication failed' };
  }
}

export{ login };
