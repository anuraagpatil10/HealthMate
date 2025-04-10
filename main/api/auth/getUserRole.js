const { api } = require('../../utils/httpClient');
const { session } = require('electron');
const { debugLog, errorLog, infoLog, warnLog } = require('../../utils/logger');

/**
 * Retrieves the authenticated user's role
 * @returns {Promise<Object>} User role information or error
 */
async function getUserRole() {
  infoLog('Fetching user role');
  
  try {
    // Check for valid session cookie
    debugLog('Checking for valid session cookie');
    const cookies = await session.defaultSession.cookies.get({});
    const accessToken = cookies.find(cookie => cookie.name === 'healthMateSession');
    
    if (!accessToken) {
      errorLog('No access token found in cookies');
      return { error: 'No access token found' };
    }
    
    // Validate session data structure
    let sessionData;
    try {
      sessionData = JSON.parse(accessToken.value);
      if (!sessionData.access_token) {
        throw new Error('Invalid token structure');
      }
      debugLog('Session token found and validated');
    } catch (error) {
      errorLog('Invalid session data format', error);
      return { error: 'Invalid session data' };
    }
    
    // Make API request according to documentation
    debugLog('Requesting user role from API');
    const response = await api.get('/api/user-role');
    
    if (response.data && response.data.role) {
      const userRole = response.data.role.toLowerCase();
      infoLog(`User role retrieved successfully: ${userRole}`);
      
      // Validate returned role
      if (!['patient', 'doctor', 'admin'].includes(userRole)) {
        warnLog(`Unexpected role value received: ${userRole}`);
      }
      
      return { role: userRole };
    } else {
      errorLog('User role not found in API response', response.data);
      return { error: 'User role not found' };
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    const statusCode = error.response?.status;
    
    errorLog(`Get user role error (${statusCode})`, errorMessage);
    
    if (statusCode === 401) {
      return { error: 'Authentication expired. Please login again.' };
    }
    
    return { error: errorMessage || 'Failed to retrieve user role' };
  }
}

export { getUserRole }; 