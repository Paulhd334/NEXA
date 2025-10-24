// /api/admin-reset-password.js
export default async function handler(req, res) {
  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;
    
    console.log('📧 Reset request for:', email);

    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    // Vérifier que la clé service existe
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
    if (!SUPABASE_SERVICE_KEY) {
      console.error('❌ SUPABASE_SERVICE_KEY manquante');
      return res.status(500).json({ error: 'Configuration manquante' });
    }

    const SUPABASE_URL = 'https://itnrlxfbejgxbibezoup.supabase.co';

    // Appel à l'API Supabase
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

    const result = await response.json();

    console.log('📨 Supabase response:', { status: response.status, result });

    if (!response.ok) {
      throw new Error(result.message || `Erreur ${response.status}`);
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Email envoyé avec succès' 
    });

  } catch (error) {
    console.error('💥 API Error:', error);
    return res.status(500).json({ 
      error: error.message || 'Erreur interne'
    });
  }
}
