const { api, storeSessionInCookies } = require('../../utils/httpClient');
const { session } = require('electron');
const { debugLog, errorLog, infoLog, warnLog } = require('../../utils/logger');

/**
 * Refreshes access token using a valid refresh token
 * @returns {Promise<Object>} New tokens or error
 */
async function refreshToken() {
  infoLog('Attempting to refresh authentication token');
  
  try {
    // Get refresh token from cookies
    debugLog('Retrieving session cookie for refresh token');
    const cookies = await session.defaultSession.cookies.get({ name: 'healthMateSession' });
    const sessionCookie = cookies.find(cookie => cookie.name === 'healthMateSession');
    
    if (!sessionCookie) {
      errorLog('No session cookie found');
      return { error: 'No session found' };
    }
    
    // Extract refresh token according to API documentation
    let sessionData;
    try {
      sessionData = JSON.parse(sessionCookie.value);
      if (!sessionData.refresh_token) {
        throw new Error('Invalid token structure');
      }
      debugLog('Refresh token found in session cookie');
    } catch (error) {
      errorLog('Invalid session data format', error);
      return { error: 'Invalid session data' };
    }
    
    // Make API request according to documentation
    debugLog('Sending refresh token request to API');
    const response = await api.post('/api/refresh-token', {
      refresh_token: sessionData.refresh_token
    });
    
    if (response.data && response.data.data) {
      infoLog('Token refresh successful');
      
      // Store new session data
      const newSessionData = response.data.data;
      storeSessionInCookies(newSessionData);
      debugLog('New tokens stored in session cookie');
      
      return { data: newSessionData };
    } else {
      errorLog('Invalid response from refresh token API', response.data);
      return { error: 'Failed to refresh token' };
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    const statusCode = error.response?.status;
    
    errorLog(`Refresh token error (${statusCode})`, errorMessage);
    
    if (statusCode === 401) {
      return { error: 'Refresh token is invalid or expired. Please login again.' };
    }
    
    return { error: errorMessage || 'Failed to refresh token' };
  }
}

export{ refreshToken }; 