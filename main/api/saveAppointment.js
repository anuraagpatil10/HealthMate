// electron/api/saveAppointment.js
const { supabase } = require('../utils/supabaseClient'); // Import shared Supabase client

async function saveAppointment(appointment) {
  
  const { data, error } = await supabase
    .from('appointments')
    .insert([appointment])
    .single();

  if (error) {
    console.error('Error saving appointment:', error);
    return { error: error.message };
  } else {
    return {error : false};
  }
}

module.exports = { saveAppointment };