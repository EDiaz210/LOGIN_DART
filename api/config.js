export default (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  return res.status(200).json({
    supabaseUrl: process.env.SUPABASE_URL || 'https://lnvevruftnmfmaswszvv.supabase.co',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || 'sb_publishable_JnadYW9Wqs441mZjNLaJSA_9XKgUnQx'
  });
};
