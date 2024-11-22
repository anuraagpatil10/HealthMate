// electron/api/fetchData.js
const { supabase } = require('../utils/supabaseClient'); // Import shared Supabase client

async function fetchData(table) {
  const { data, error } = await supabase.from(table).select('*');
  if (error) {
    console.error('Fetch Data Error:', error.message);
    throw new Error(error.message);
  }
  return data;
}

module.exports = { fetchData };
