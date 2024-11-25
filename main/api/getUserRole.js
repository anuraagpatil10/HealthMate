// electron/api/getUserRole.js
const { supabase } = require('../utils/supabaseClient'); // Import shared Supabase client
const { session } = require('electron');

async function getUserRole() {
  const cookies = await session.defaultSession.cookies.get({});
  const accessToken = cookies.find(cookie => cookie.name === 'supabaseSession');
  if (accessToken) {
    const userSession = JSON.parse(accessToken.value);
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('user_id', userSession.user.id)
      .single();
    if (userError) {
      console.error('User Role Error:', userError.message);
      return { error: userError.message };
    }
    return { role: userData.role };
  }
  return { error: 'No access token found' };
}

export{ getUserRole };