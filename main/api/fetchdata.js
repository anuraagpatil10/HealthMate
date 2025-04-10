// electron/api/fetchData.js
const { api } = require('../utils/httpClient');

/**
 * Fetches data from a specific API endpoint
 * @param {string} table - API endpoint/table name to fetch data from
 * @returns {Promise<Array>} Retrieved data as an array or empty array on error
 * @throws {Error} If the request fails critically
 */
async function fetchData(table) {
  if (!table || typeof table !== 'string') {
    console.error('Invalid table parameter for fetchData:', table);
    return [];
  }
  
  const sanitizedTable = table.trim().toLowerCase();
  console.log(`Fetching data from endpoint: /api/${sanitizedTable}`);
  
  try {
    const response = await api.get(`/api/${sanitizedTable}`);
    
    if (response.data) {
      // Handle different response formats
      const responseData = response.data.data || response.data[sanitizedTable] || response.data;
      
      if (Array.isArray(responseData)) {
        console.log(`Successfully retrieved ${responseData.length} items from ${sanitizedTable}`);
        return responseData;
      } else if (typeof responseData === 'object') {
        console.log(`Successfully retrieved data object from ${sanitizedTable}`);
        return [responseData]; // Wrap object in array for consistent return type
      } else {
        console.warn(`Unexpected data format from ${sanitizedTable}:`, typeof responseData);
        return [];
      }
    } else {
      console.error(`Empty response data from ${sanitizedTable}`);
      return [];
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    const statusCode = error.response?.status;
    
    console.error(`Error fetching data from ${sanitizedTable} (${statusCode}):`, errorMessage);
    
    // Handle specific error cases
    if (statusCode === 404) {
      console.warn(`Endpoint /api/${sanitizedTable} not found`);
    } else if (statusCode === 401) {
      console.warn(`Authentication required for /api/${sanitizedTable}`);
    }
    
    // For critical errors, throw so the caller can handle them
    if (!error.response || error.code === 'ECONNREFUSED') {
      throw new Error(`API connection failed: ${errorMessage}`);
    }
    
    return []; // Return empty array for non-critical errors
  }
}

export { fetchData };
