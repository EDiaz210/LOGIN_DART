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
    
    // Extract the full URL to exchange for session
    const fullUrl = window.location.href;
    console.log('Exchange URL:', fullUrl);
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(fullUrl);
    
    if (error) {
      console.error('Error exchanging code:', error);
      showError('Error al procesar el enlace de restablecimiento: ' + error.message);
      return;
    }
    
    console.log('Session established:', data);
    // Session is now established, allow user to reset password
  } catch (err) {
    console.error('Exception:', err);
    showError('Error durante la autenticación: ' + err.message);
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
    const { data, error } = await supabase.auth.updateUser({ password: password });
    
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



