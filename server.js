console.log('=== STARTING APP ===');

try {
  require('dotenv').config();
  const express = require('express');
  console.log('Express loaded OK');
  
  const path = require('path');
  console.log('Path loaded OK');
  
  const app = express();
  const PORT = process.env.PORT || 3000;
  
  console.log('Dirname:', __dirname);
  console.log('Public path:', path.join(__dirname, 'public'));
  
  app.use(express.static(path.join(__dirname, 'public')));
  
  // Endpoint to provide environment variables to client
  app.get('/api/config', (req, res) => {
    res.json({
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY
    });
  });
  
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'reset-password.html'));
  });
  
  app.get('/reset-password', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'reset-password.html'));
  });
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log('=== SERVER RUNNING ON PORT', PORT, '===');
  });
  
} catch (error) {
  console.log('=== ERROR ===');
  console.log(error);
}
