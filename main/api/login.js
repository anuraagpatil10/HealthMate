// electron/api/login.js
const { supabase } = require('../utils/supabaseClient'); // Import shared Supabase client
const { session } = require('electron');

async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error('Login Error:', error.message);
  }

  const user = data.user;
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (userError) {
    console.error('User Role Error:', userError.message);
  }

  // Save session data in cookies
  const userSession = data.session;
  if (userSession) {
    const cookie = {
      url: 'http://localhost', // Use your app's URL
      name: 'supabaseSession',
      value: JSON.stringify(userSession),
      expirationDate: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 // 1 week
    };
    session.defaultSession.cookies.set(cookie, (error) => {
      if (error) console.error('Failed to save cookie:', error);
    });
  }

  return { data, role: userData.role };
}

export{ login };
