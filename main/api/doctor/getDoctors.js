const { api } = require('../../utils/httpClient');
const { debugLog, errorLog, infoLog, warnLog } = require('../../utils/logger');

/**
 * Retrieves list of all doctors
 * @returns {Promise<Object>} List of doctors or error
 */
async function getDoctors() {
  infoLog('Fetching doctors list');
  
  try {
    // Make API request according to documentation
    debugLog('Requesting doctors data from API');
    const response = await api.get('/api/doctors');
    
    if (response.data && Array.isArray(response.data.doctors)) {
      const doctorsList = response.data.doctors;
      infoLog(`Retrieved ${doctorsList.length} doctors`);
      
      // Validate and normalize doctor data according to API documentation
      debugLog('Validating doctor data structure');
      const validatedDoctors = doctorsList.map(doctor => {
        // Check for required fields based on API documentation
        if (!doctor.doctor_id) {
          warnLog('Doctor missing ID', doctor);
        }
        
        // Return a validated doctor object with normalized field names
        // to make it consistent across the application
        return {
          id: doctor.doctor_id || doctor.id,
          name: doctor.full_name || doctor.name || 'Unknown',
          email: doctor.email || '',
          phone_number: doctor.phone_number || '',
          gender: doctor.gender || '',
          specialty: doctor.speciality || doctor.specialty || '',
          clinic_name: doctor.clinic_name || ''
        };
      });
      
      debugLog('Doctors data normalized successfully');
      return { data: validatedDoctors };
    } else {
      errorLog('Invalid doctors data format received from API', response.data);
      return { error: 'Invalid doctors data received', data: [] };
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    const statusCode = error.response?.status;
    
    errorLog(`Error fetching doctors (${statusCode})`, errorMessage);
    
    if (statusCode === 401) {
      return { error: 'Authentication required', data: [] };
    } else if (statusCode === 403) {
      return { error: 'Not authorized to view doctors', data: [] };
    }
    
    return { 
      error: errorMessage || 'Failed to retrieve doctors', 
      data: [] // Always return an empty array to prevent UI errors
    };
  }
}

export { getDoctors }; 