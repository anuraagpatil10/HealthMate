// electron/api/patient/getPatientAppointments.js
const { api } = require('../../utils/httpClient');
const { debugLog, errorLog, infoLog, warnLog } = require('../../utils/logger');

/**
 * Retrieves appointments for a specific patient
 * @param {string} patientId - ID of the patient to get appointments for
 * @returns {Promise<Object>} Object containing either appointment data or error
 */
async function getPatientAppointments(patientId) {
  infoLog(`Fetching appointments for patient: ${patientId || 'unknown'}`);
  
  if (!patientId) {
    errorLog('Patient ID is required to fetch appointments');
    return { error: 'Patient ID is required' };
  }
  
  try {
    // Make API request according to documentation
    debugLog(`Requesting appointments data for patient ${patientId} from API`);
    const response = await api.get(`/api/patient/appointments/${patientId}`);
    
    if (response.data && Array.isArray(response.data)) {
      const appointments = response.data;
      infoLog(`Retrieved ${appointments.length} appointments for patient ${patientId}`);
      
      // Validate and normalize appointment data according to API documentation
      debugLog('Validating appointment data structure');
      const validatedAppointments = appointments.map(appointment => {
        // Check required fields based on API documentation
        const requiredFields = ['id', 'doctor_id', 'date', 'time', 'status'];
        const missingFields = requiredFields.filter(field => !appointment[field]);
        
        if (missingFields.length > 0) {
          warnLog(`Appointment is missing required fields: ${missingFields.join(', ')}`, appointment);
        }
        
        // Normalize fields to be consistent across the application
        return {
          id: appointment.id,
          doctor_id: appointment.doctor_id,
          doctor_name: appointment.doctor_name || 'Unknown Doctor',
          department: appointment.department || '',
          date: appointment.date,
          time: appointment.time,
          type: appointment.type || 'Consultation',
          reason: appointment.reason || '',
          status: appointment.status || 'Pending',
          notes: appointment.notes || '',
          created_at: appointment.created_at
        };
      });
      
      debugLog('Appointments data normalized successfully');
      return { data: validatedAppointments };
    } else {
      errorLog('Invalid response format from appointments API', response.data);
      return { error: 'Failed to retrieve appointments - invalid response format' };
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    const statusCode = error.response?.status;
    
    errorLog(`Error fetching patient appointments (${statusCode})`, errorMessage);
    
    if (statusCode === 401) {
      return { error: 'Authentication required to access appointments' };
    } else if (statusCode === 403) {
      return { error: 'You do not have permission to view these appointments' };
    } else if (statusCode === 404) {
      return { error: 'Patient not found or has no appointments' };
    }
    
    return { error: errorMessage || 'Failed to fetch appointments' };
  }
}

export { getPatientAppointments };