// electron/api/saveAppointment.js
const { api } = require('../utils/httpClient');

/**
 * Saves a new appointment
 * @param {Object} appointment - Appointment data object
 * @param {string} appointment.doctor_id - ID of the doctor
 * @param {string} appointment.patient_id - ID of the patient
 * @param {string} appointment.date - Appointment date in YYYY-MM-DD format
 * @param {string} appointment.time - Appointment time
 * @param {string} appointment.type - Type of appointment
 * @param {string} appointment.reason - Reason for appointment
 * @param {string} appointment.status - Status of appointment (default: "Pending")
 * @returns {Promise<Object>} Result object indicating success or error
 */
async function saveAppointment(appointment) {
  console.log('Saving new appointment');
  
  // Input validation
  if (!appointment) {
    console.error('Appointment data is required');
    return { error: 'Appointment data is required' };
  }
  
  const { doctor_id, patient_id, date, time, type } = appointment;
  
  if (!doctor_id || !patient_id || !date || !time) {
    console.error('Missing required appointment fields:', { doctor_id, patient_id, date, time });
    return { 
      error: 'Doctor ID, Patient ID, date, and time are required',
      fields: { doctor_id, patient_id, date, time }
    };
  }
  
  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    console.error(`Invalid date format: ${date}`);
    return { error: 'Date must be in YYYY-MM-DD format' };
  }
  
  // Ensure appointment object has all required fields
  const appointmentData = {
    doctor_id,
    patient_id,
    date,
    time,
    type: type || 'Consultation',
    reason: appointment.reason || '',
    status: appointment.status || 'Pending'
  };
  
  console.log('Sending appointment data to API:', appointmentData);
  
  try {
    const response = await api.post('/api/patient/appointments', appointmentData);
    
    if (response.data) {
      console.log('Appointment saved successfully:', response.data);
      return { 
        data: response.data, 
        error: false,
        message: 'Appointment scheduled successfully'
      };
  } else {
      console.error('No data received from appointment creation API');
      return { error: 'Failed to create appointment - no response data' };
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    const statusCode = error.response?.status;
    
    console.error(`Error saving appointment (${statusCode}):`, errorMessage);
    
    if (statusCode === 401) {
      return { error: 'Authentication required to schedule appointment' };
    } else if (statusCode === 400) {
      return { error: 'Invalid appointment data. Please check all fields.' };
    } else if (statusCode === 409) {
      return { error: 'This time slot is already booked. Please select another time.' };
    }
    
    return { error: errorMessage || 'Failed to schedule appointment' };
  }
}

module.exports = { saveAppointment };