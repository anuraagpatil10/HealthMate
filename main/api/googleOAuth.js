// electron/api/googleOAuth.js
const { session } = require('electron');
const { supabase } = require('../utils/supabaseClient');

async function loginWithGoogle(mainWindow) {
  console.log('NODE_ENV:', process.env.NODE_ENV);
  const redirectTo = process.env.NODE_ENV === 'production' ? 'app://./app/dashboard' : 'http://localhost:8888/app/dashboard';
  console.log('Redirect URL:', redirectTo);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
    },
  });

  if (error) {
    console.error('Google Login Error:', error.message);
    throw new Error(error.message);
  }

  const authUrl = data.url;
  console.log('Auth URL:', authUrl);

  // Load Google OAuth URL in the main window
  mainWindow.loadURL(authUrl);

  return new Promise((resolve, reject) => {
    const handleNavigation = async (url) => {
      console.log('Navigated to URL:', url);
      if (url.includes('access_token')) {
        try {
          // Extract tokens from URL
          const urlObj = new URL(url);
          const hashParams = new URLSearchParams(urlObj.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');

          // Save tokens in cookies
          const cookie = {
            url: process.env.NODE_ENV === 'production' ? 'app://' : 'http://localhost',
            name: 'supabaseSession',
            value: JSON.stringify({
              access_token: accessToken,
              refresh_token: refreshToken
            }),
            expirationDate: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 // 1 week
          };

          // Set cookie and wait for it to complete
          await new Promise((resolveSet, rejectSet) => {
            session.defaultSession.cookies.set(cookie, (error) => {
              if (error) {
                console.error('Failed to save cookie:', error);
                rejectSet(error);
              } else {
                resolveSet();
              }
            });
          });

          // Set Supabase session
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          // Redirect to dashboard
          const redirectUrl = process.env.NODE_ENV === 'production' 
            ? 'app://./app/dashboard' 
            : 'http://localhost:8888/app/dashboard';
          mainWindow.loadURL(redirectUrl);

          resolve({ accessToken });
        } catch (error) {
          console.error('Error handling OAuth callback:', error);
          reject(error);
        }
      }
    };

    // Listen for URL changes
    mainWindow.webContents.on('will-navigate', (event, url) => {
      if (url.includes('access_token')) {
        event.preventDefault();
        handleNavigation(url);
      }
    });

    mainWindow.webContents.on('did-navigate', (event, url) => {
      handleNavigation(url);
    });

  });
}

export{ loginWithGoogle };