// electron/api/login.js
const { supabase } = require('./supabaseClient'); // Import shared Supabase client

async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error('Login Error:', error.message);
    throw new Error(error.message);
  }
  return data;
}

module.exports = { login };
