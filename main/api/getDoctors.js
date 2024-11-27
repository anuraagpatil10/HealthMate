// electron/api/getDoctors.js
const { supabase } = require('../utils/supabaseClient'); // Import shared Supabase client

async function getDoctors() {
  const { data, error } = await supabase
    .from('doctors')
    .select('*');

  if (error) {
    console.error('Error fetching doctors:', error);
    return { error: error.message };
  } else {
    return { data };
  }
}

module.exports = { getDoctors };