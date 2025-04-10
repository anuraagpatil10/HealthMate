const { api } = require('../../utils/httpClient');
const { debugLog, errorLog, infoLog, warnLog } = require('../../utils/logger');

/**
 * Fetches authenticated user's profile
 * @returns {Promise<Object>} User profile data or error
 */
async function getProfile() {
  infoLog('Fetching user profile');
  
  try {
    // Make API request according to documentation
    debugLog('Requesting profile data from API');
    const response = await api.get('/api/get-profile');
    
    if (response.data) {
      infoLog('User profile retrieved successfully');
      
      // Validate profile data according to API documentation
      const profile = response.data;
      debugLog('Profile data received', profile);
      
      // Verify that required fields exist based on API documentation
      if (!profile.id || !profile.email || !profile.role) {
        warnLog('Profile data missing required fields', profile);
      }
      
      // Additional role-specific validation
      if (profile.role === 'doctor' && !profile.speciality) {
        warnLog('Doctor profile missing speciality field', profile);
      }
      
      return { profile: response.data };
    } else {
      errorLog('Empty profile data received from API');
      return { error: 'Failed to retrieve profile data' };
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    const statusCode = error.response?.status;
    
    errorLog(`Get profile error (${statusCode})`, errorMessage);
    
    if (statusCode === 401) {
      return { error: 'Authentication required. Please login.' };
    } else if (statusCode === 404) {
      return { error: 'Profile not found. Please complete your profile.' };
    }
    
    return { error: errorMessage || 'Failed to retrieve profile' };
  }
}

module.exports = { getProfile }; 