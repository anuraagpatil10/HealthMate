// main/utils/httpClient.js
const axios = require('axios');
const { session } = require('electron');
const { debugLog, errorLog, infoLog, warnLog } = require('./logger');
require('dotenv').config();

// Get API base URL from environment variables
const API_BASE_URL = process.env.API_BASE_URL || 'https://healthmate-backend-api-aahn.onrender.com';

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout to prevent hanging requests
  timeout: 15000,
});

/**
 * Request interceptor that attaches the auth token from cookies to each request
 * This ensures authenticated API calls without manually adding the token each time
 */
api.interceptors.request.use(
  async (config) => {
    try {
      // Get cookies to find auth token
      const cookies = await session.defaultSession.cookies.get({ name: 'healthMateSession' });
      const sessionCookie = cookies.find(cookie => cookie.name === 'healthMateSession');
      
      if (sessionCookie) {
        const sessionData = JSON.parse(sessionCookie.value);
        if (sessionData.access_token) {
          config.headers.Authorization = `Bearer ${sessionData.access_token}`;
          debugLog('Auth token attached to request');
        } else {
          warnLog('Session found but no access token available');
        }
      } else {
        debugLog('No session cookie found, request will be unauthenticated');
      }
      return config;
    } catch (error) {
      errorLog('Error setting auth header', error);
      // Continue with the request even if we can't attach the token
      return config;
    }
  },
  (error) => {
    errorLog('Request interceptor error', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle common API response patterns
 * and provide consistent error handling
 */
api.interceptors.response.use(
  (response) => {
    debugLog(`API response from ${response.config.url}`, 
      { status: response.status, method: response.config.method });
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorLog(`API Error Response (${error.response.status})`, {
        url: error.config.url,
        method: error.config.method,
        data: error.response.data
      });
      
      // Handle 401 Unauthorized errors - could trigger token refresh or logout
      if (error.response.status === 401) {
        warnLog('Authentication error, user may need to re-login');
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorLog('API No Response Error', {
        url: error.config.url,
        method: error.config.method
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      errorLog('API Request Setup Error', error.message);
    }
    
    return Promise.reject(error);
  }
);

/**
 * Stores session data in cookies
 * @param {Object} sessionData - Session data containing access_token and refresh_token
 */
const storeSessionInCookies = (sessionData) => {
  if (!sessionData || !sessionData.access_token) {
    errorLog('Invalid session data received, cannot store in cookies');
    return;
  }
  
  const cookie = {
    url: 'http://localhost',
    name: 'healthMateSession',
    value: JSON.stringify(sessionData),
    expirationDate: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 // 1 week
  };
  
  session.defaultSession.cookies.set(cookie, (error) => {
    if (error) {
      errorLog('Failed to save cookie', error);
    } else {
      infoLog('Session cookie stored successfully');
    }
  });
};

/**
 * Logs out user by removing session cookie
 * @returns {Promise<Object>} Result object indicating success or failure
 */
const logout = async () => {
  try {
    // Remove the cookie as backend handles token invalidation
    await session.defaultSession.cookies.remove('http://localhost', 'healthMateSession');
    infoLog('User logged out successfully, session cookie removed');
    return { success: true };
  } catch (error) {
    errorLog('Logout error', error);
    throw error;
  }
};

export{
  api,
  storeSessionInCookies,
  logout,
  API_BASE_URL
}; 