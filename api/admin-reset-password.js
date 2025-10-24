// /api/admin-reset-password.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    // Utilisez la clé de SERVICE ROLE (pas anon key)
    const SUPABASE_URL = 'https://itnrlxfbejgxbibezoup.supabase.co';
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

    // Appel direct à l'API Admin (pas de rate limit)
    const response = await fetch(`${SUPABASE_URL}/auth/v1/recover`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY
      },
      body: JSON.stringify({
        email: email,
        redirect_to: 'https://nexa-neon.vercel.app/account/update-password.html'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur Supabase');
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Email envoyé avec succès' 
    });

  } catch (error) {
    return res.status(500).json({ 
      error: 'Erreur: ' + error.message 
    });
  }
}
