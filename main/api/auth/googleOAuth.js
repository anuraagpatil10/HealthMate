const { session } = require('electron');
const { api, API_BASE_URL, storeSessionInCookies } = require('../../utils/httpClient');

/**
 * Handles Google OAuth authentication flow
 * @param {Object} mainWindow - Electron main window instance
 * @returns {Promise<Object>} Authentication result
 */
async function loginWithGoogle(mainWindow) {
  if (!mainWindow) {
    throw new Error('Main window is required for Google OAuth');
  }

  console.log('Starting Google OAuth login flow');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  
  // Determine redirect URL based on environment
  const redirectTo = process.env.NODE_ENV === 'production' 
    ? 'app://./app/dashboard' 
    : 'http://localhost:8888/app/dashboard';
    
  console.log('Redirect URL:', redirectTo);

  // Set timeout for the entire process
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Google OAuth timeout after 2 minutes')), 120000);
  });

  try {
    console.log('Requesting OAuth URL from backend');
    // Request OAuth URL from backend
    const response = await Promise.race([
      api.get('/api/auth/google-oauth-url', {
        params: { redirectTo }
      }),
      timeoutPromise
    ]);

    if (!response.data || !response.data.url) {
      console.error('Invalid OAuth URL response:', response.data);
      throw new Error('Failed to get Google OAuth URL');
    }

    const authUrl = response.data.url;
    console.log('Auth URL received, redirecting user to Google login');

    // Load Google OAuth URL in the main window
    mainWindow.loadURL(authUrl);

    // Handle the OAuth callback
    return await Promise.race([
      new Promise((resolve, reject) => {
        // Flag to prevent multiple resolution
        let isResolved = false;
      
        const handleNavigation = async (url) => {
          try {
            console.log('Navigation detected to:', url);
            if (isResolved) return;
            
            if (url.includes(API_BASE_URL) && url.includes('/auth/callback')) {
              console.log('OAuth callback detected');
            
              // Extract token from URL
              const urlObj = new URL(url);
              const code = urlObj.searchParams.get('code');
              
              if (!code) {
                console.error('No authorization code in callback URL');
                if (!isResolved) {
                  isResolved = true;
                  reject(new Error('No authorization code received'));
                }
                return;
              }
              
              console.log('Authorization code received, exchanging for tokens');
              
              try {
                // Exchange code for tokens
                const tokenResponse = await api.post('/api/auth/google-callback', {
                  code,
                  redirectUri: redirectTo
                });
                
                if (tokenResponse.data && 
                    tokenResponse.data.data && 
                    tokenResponse.data.data.session) {
                  
                  console.log('Tokens received successfully');
                  // Store tokens in cookie
                  storeSessionInCookies(tokenResponse.data.data.session);
                  
                  // Redirect to dashboard based on user role
                  const role = tokenResponse.data.role || 'patient';
                  console.log(`User authenticated with role: ${role}`);
                  
                  const dashboardUrl = process.env.NODE_ENV === 'production' 
                    ? `app://./${role}/dashboard` 
                    : `http://localhost:8888/${role}/dashboard`;
                  
                  console.log(`Redirecting to dashboard: ${dashboardUrl}`);
                  mainWindow.loadURL(dashboardUrl);
                  
                  if (!isResolved) {
                    isResolved = true;
                    resolve({ data: tokenResponse.data });
                  }
                } else {
                  console.error('Invalid token response:', tokenResponse.data);
                  if (!isResolved) {
                    isResolved = true;
                    reject(new Error('Invalid token response'));
                  }
                }
              } catch (error) {
                console.error('Error exchanging code for tokens:', error);
                if (!isResolved) {
                  isResolved = true;
                  reject(error);
                }
              }
            }
          } catch (error) {
            console.error('Error handling navigation:', error);
            if (!isResolved) {
              isResolved = true;
              reject(error);
            }
          }
        };

        // Listen for URL changes
        mainWindow.webContents.on('will-navigate', (event, url) => {
          console.log('will-navigate event:', url);
          if (url.includes(API_BASE_URL) && url.includes('/auth/callback')) {
            event.preventDefault();
            handleNavigation(url);
          }
        });

        mainWindow.webContents.on('did-navigate', (event, url) => {
          console.log('did-navigate event:', url);
          handleNavigation(url);
        });
        
        // Additional safeguard for navigation failures
        mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
          console.error('Navigation failed:', errorCode, errorDescription);
          if (!isResolved && errorCode !== -3) { // Ignore -3 (ABORTED) as it's normal during redirects
            isResolved = true;
            reject(new Error(`Navigation failed: ${errorDescription} (${errorCode})`));
          }
        });
      }),
      timeoutPromise
    ]);
  } catch (error) {
    console.error('Google OAuth Error:', error);
    // Redirect back to login page on failure
    try {
      const loginUrl = process.env.NODE_ENV === 'production' 
        ? 'app://./login'
        : 'http://localhost:8888/login';
      mainWindow.loadURL(loginUrl);
    } catch (navError) {
      console.error('Failed to navigate back to login page:', navError);
    }
    throw error;
  }
}

export { loginWithGoogle }; 