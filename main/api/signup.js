// electron/api/signup.js
const { api } = require('../utils/httpClient');

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
  // Input validation
  if (!email || !password || !fullName || !role) {
    console.error('Missing required signup parameters');
    return { error: 'Email, password, full name, and role are required' };
  }
  
  if (!['patient', 'doctor'].includes(role.toLowerCase())) {
    console.error(`Invalid role provided: ${role}`);
    return { error: 'Role must be either "patient" or "doctor"' };
  }
  
  console.log(`Signup attempt for email: ${email}, role: ${role}`);

  try {
    console.log('Sending signup request to backend API...');
    const response = await api.post('/api/signup', {
    email,
    password,
      fullName,
      phoneNumber,
        gender,                    
      role
    });

    if (response.data && response.data.data) {
      console.log(`User registered successfully: ${email}`);
      return { data: response.data.data };
    } else {
      console.error('Signup response missing data');
      return { error: 'Invalid response from server' };
  }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    const statusCode = error.response?.status;
    console.error(`Signup Error (${statusCode}):`, errorMessage);
    
    // Provide more specific error messages based on status codes
    if (statusCode === 409) {
      return { error: 'This email is already registered' };
    } else if (statusCode === 400) {
      return { error: 'Invalid signup information. Please check your details.' };
    }
    
    return { error: errorMessage || 'Registration failed' };
}
}

export  { signup };
