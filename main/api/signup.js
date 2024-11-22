// electron/api/signup.js
const { supabase } = require('../utils/supabaseClient'); // Import shared Supabase client

async function signup(email, password, fullName, phoneNumber, gender) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone_number: phoneNumber,
        gender: gender,
      },
    },
  });

  if (error) {
    console.error('Signup Error:', error.message);
    throw new Error(error.message);
  }

  return data;
}

module.exports = { signup };
