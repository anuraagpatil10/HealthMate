// electron/api/supabaseClient.js
const { createClient } = require('@supabase/supabase-js');
const path = require('path'); // Correct import for `path` module
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Initialize Supabase client
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// Check if the environment variables are loaded
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Supabase environment variables are missing.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function logout() {
  await supabase.auth.signOut();
  const { session } = require('electron');
  session.defaultSession.cookies.remove('http://localhost', 'supabaseSession', (error) => {
    if (error) console.error('Failed to remove cookie:', error);
  });
}

module.exports = { supabase, logout };
