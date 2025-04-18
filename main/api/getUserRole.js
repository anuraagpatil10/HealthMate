// electron/api/getUserRole.js
const { api } = require('../utils/httpClient');
const { session } = require('electron');

/**
 * Retrieves the authenticated user's role
 * @returns {Promise<Object>} User role information or error
 */
async function getUserRole() {
  console.log('Fetching user role...');
  
  try {
    // Check for valid session cookie
  const cookies = await session.defaultSession.cookies.get({});
    const accessToken = cookies.find(cookie => cookie.name === 'healthMateSession');
    
    if (!accessToken) {
      console.error('No access token found in cookies');
      return { error: 'No access token found' };
    }
    
    // Validate session data structure
    let sessionData;
    try {
      sessionData = JSON.parse(accessToken.value);
      if (!sessionData.access_token) {
        throw new Error('Invalid token structure');
      }
    } catch (error) {
      console.error('Invalid session data format:', error);
      return { error: 'Invalid session data' };
    }
    
    console.log('Requesting user role from API...');
    const response = await api.get('/api/user-role');
    
    if (response.data && response.data.role) {
      const userRole = response.data.role.toLowerCase();
      console.log(`User role retrieved successfully: ${userRole}`);
      
      // Validate returned role
      if (!['patient', 'doctor', 'admin'].includes(userRole)) {
        console.warn(`Unexpected role value received: ${userRole}`);
      }
      
      return { role: userRole };
    } else {
      console.error('User role not found in API response');
      return { error: 'User role not found' };
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    const statusCode = error.response?.status;
    
    console.error(`Get User Role Error (${statusCode}):`, errorMessage);
    
    if (statusCode === 401) {
      return { error: 'Authentication expired. Please login again.' };
  }
    
    return { error: errorMessage || 'Failed to retrieve user role' };
  }
}

export{ getUserRole };