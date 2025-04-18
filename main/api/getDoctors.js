// electron/api/getDoctors.js
const { api } = require('../utils/httpClient');

/**
 * Retrieves list of all doctors
 * @returns {Promise<Object>} List of doctors or error
 */
async function getDoctors() {
  console.log('Fetching doctors list...');
  
  try {
    const response = await api.get('/api/doctors');
    
    if (response.data && Array.isArray(response.data.doctors)) {
      const doctorsList = response.data.doctors;
      console.log(`Retrieved ${doctorsList.length} doctors`);
      
      // Validate doctor data structure
      const validatedDoctors = doctorsList.map(doctor => {
        // Ensure each doctor has required fields
        if (!doctor.doctor_id) {
          console.warn('Doctor missing ID:', doctor);
        }
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
      
      return { data: validatedDoctors };
  } else {
      console.error('Invalid doctors data format received from API');
      return { error: 'Invalid doctors data received', data: [] };
  }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    const statusCode = error.response?.status;
    
    console.error(`Error fetching doctors (${statusCode}):`, errorMessage);
    
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

