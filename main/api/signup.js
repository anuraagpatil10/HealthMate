// electron/api/signup.js
const { supabase } = require('./supabaseClient'); // Import shared Supabase client

async function signup(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    console.error('Signup Error:', error.message);
    throw new Error(error.message);
  }
  return data;
}

module.exports = { signup };
