// electron/api/signup.js
const { supabase } = require('../utils/supabaseClient'); // Import shared Supabase client

async function signup(email, password, fullName, phoneNumber, gender, role) {
  console.log("Role received in API: ", role); // Add logging here

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,       // Optional field
        phone_number: phoneNumber, // Optional field
        gender,                    
        role,                      // Ensure role is included here
      },
    },
  });

  if (error) {
    console.error('Signup Error:', error.message);
    return { error: error.message };
  }

  const user = data.user;
  console.log('User:', user);
  const { error: insertError } = await supabase
    .from('users')
    .insert([
      {
        user_id: user.id,
        email: email,
        full_name: fullName,
        phone_number: phoneNumber,
        gender: gender,
        role: role,
      },
    ]);

  if (insertError) {
    console.error('Insert User Error:', insertError.message);
    return { error: insertError.message };
  }

  return { data };
}

module.exports = { signup };
