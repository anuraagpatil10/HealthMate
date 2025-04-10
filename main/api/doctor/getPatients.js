const { api } = require('../../utils/httpClient');
const { debugLog, errorLog, infoLog, warnLog } = require('../../utils/logger');

/**
 * Retrieves list of patients who booked with the doctor
 * @returns {Promise<Object>} List of patients or error
 */
async function getDoctorPatients() {
  infoLog('Fetching patients list for doctor');
  
  try {
    // Make API request according to documentation
    debugLog('Requesting patients data from API');
    const response = await api.get('/api/doctor/patients');
    
    if (response.data && Array.isArray(response.data.patients)) {
      const patientsList = response.data.patients;
      infoLog(`Retrieved ${patientsList.length} patients`);
      
      // Validate and normalize patient data according to API documentation
      debugLog('Validating patient data structure');
      const validatedPatients = patientsList.map(patient => {
        // Check for required fields based on API documentation
        if (!patient.patient_id) {
          warnLog('Patient missing ID', patient);
        }
        
        // Return a validated patient object with normalized field names
        // to make it consistent across the application
        return {
          id: patient.patient_id || patient.id,
          name: patient.full_name || patient.name || 'Unknown',
          email: patient.email || '',
          phone_number: patient.phone_number || '',
          gender: patient.gender || '',
          dob: patient.dob || patient.date_of_birth || ''
        };
      });
      
      debugLog('Patients data normalized successfully');
      return { data: validatedPatients };
    } else {
      errorLog('Invalid patients data format received from API', response.data);
      return { error: 'Invalid patients data received', data: [] };
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    const statusCode = error.response?.status;
    
    errorLog(`Error fetching patients (${statusCode})`, errorMessage);
    
    if (statusCode === 401) {
      return { error: 'Authentication required', data: [] };
    } else if (statusCode === 403) {
      return { error: 'Not authorized to view patients', data: [] };
    }
    
    return { 
      error: errorMessage || 'Failed to retrieve patients', 
      data: [] // Always return an empty array to prevent UI errors
    };
  }
}
export{ getDoctorPatients }; 