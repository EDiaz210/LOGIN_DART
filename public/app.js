let supabase;

// Initialize Supabase client with hardcoded values (from environment variables in Vercel)
async function initializeSupabase() {
  try {
    const SUPABASE_URL = 'https://lnvevruftnmfmaswszvv.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_JnadYW9Wqs441mZjNLaJSA_9XKgUnQx';
    
    const { createClient } = window.supabase;
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase initialized');
    
    // Exchange code for session when redirected from email
    await exchangeCodeForSession();
  } catch (err) {
    console.error('Error initializing Supabase:', err);
    showError('Error al inicializar la autenticación: ' + err.message);
  }
}

// Exchange code for session when redirected from email
async function exchangeCodeForSession() {
  try {
    if (!supabase) {
      console.error('Supabase not initialized');
      return;
    }
    
    // Extract access_token from URL
    const url = new URL(window.location.href);
    const accessToken = url.searchParams.get('access_token');
    
    console.log('Access Token from URL:', accessToken);
    
    if (!accessToken) {
      console.log('No access token - user can reset password manually');
      return;
    }
    
    // Store the token for later use in password reset
    window.resetToken = accessToken;
    console.log('Reset token stored for password update');
    
  } catch (err) {
    console.error('Exception:', err);
  }
}

// Call on page load
window.addEventListener('load', initializeSupabase);

// Handle form submission
document.getElementById('resetForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const errorDiv = document.getElementById('error');
  const successDiv = document.getElementById('success');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');
  const btnLoader = document.getElementById('btnLoader');
  
  // Reset messages
  errorDiv.style.display = 'none';
  successDiv.style.display = 'none';
  
  // Validate passwords match
  if (password !== confirmPassword) {
    showError('Las contraseñas no coinciden');
    return;
  }
  
  // Validate password length
  if (password.length < 6) {
    showError('La contraseña debe tener al menos 6 caracteres');
    return;
  }
  
  // Show loading state
  submitBtn.disabled = true;
  btnText.style.display = 'none';
  btnLoader.style.display = 'inline-block';
  
  try {
    // If we have a reset token, use it to update password
    if (window.resetToken) {
      const { data, error } = await supabase.auth.updateUser(
        { password: password },
        { accessToken: window.resetToken }
      );
      
      if (error) {
        showError('Error al actualizar la contraseña: ' + error.message);
      } else {
        showSuccess('¡Contraseña actualizada correctamente! Puedes cerrar esta ventana.');
        document.getElementById('resetForm').reset();
        
        // Close window after 3 seconds
        setTimeout(() => {
          window.close();
        }, 3000);
      }
    } else {
      showError('No hay sesión activa. Por favor, intenta nuevamente con el enlace del email.');
    }
  } catch (err) {
    showError('Error: ' + err.message);
  } finally {
    submitBtn.disabled = false;
    btnText.style.display = 'inline';
    btnLoader.style.display = 'none';
  }
});

function showError(message) {
  const errorDiv = document.getElementById('error');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
}

function showSuccess(message) {
  const successDiv = document.getElementById('success');
  successDiv.textContent = message;
  successDiv.style.display = 'block';
}








