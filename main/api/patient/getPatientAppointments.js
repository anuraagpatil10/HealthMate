// electron/api/getAppointments.js
const { supabase } = require('../../utils/supabaseClient'); // Import shared Supabase client

async function getPatientAppointments(patientId) {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('patient_id', patientId);

  if (error) {
    console.error('Error fetching appointments for patient:', error);
    return { error: error.message };
  } else {
    for (let appointment of data) {
      
      const { data: doctorData, error: doctorError } = await supabase
        .from('doctors')
        .select('*')
        .eq('id', appointment.doctor_id)
        .single();
      
      if (doctorError) {
        console.error(`Error fetching doctor details for doctor_id ${appointment.doctor_id}:`, doctorError);
        continue;
      }
      
      appointment.doctor = doctorData.name;
      appointment.specialty = doctorData.specialty;
      appointment.location = doctorData.location;
    }
    return { data };
  }
}

module.exports = { getPatientAppointments };