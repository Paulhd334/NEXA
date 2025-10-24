// /api/admin-reset-password.js
export default async function handler(req, res) {
  console.log('🚀 API appelée - Méthode:', req.method);
  
  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    console.log('✅ OPTIONS préflight OK');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    console.log('❌ Mauvaise méthode:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;
    
    console.log('📧 Email reçu:', email);

    if (!email) {
      console.log('❌ Email manquant');
      return res.status(400).json({ error: 'Email required' });
    }

    // Vérifier la service key
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
    console.log('🔑 Service Key présente:', !!SUPABASE_SERVICE_KEY);
    
    if (!SUPABASE_SERVICE_KEY) {
      console.log('❌ SUPABASE_SERVICE_KEY manquante dans les variables env');
      return res.status(500).json({ error: 'Configuration manquante: SUPABASE_SERVICE_KEY' });
    }

    const SUPABASE_URL = 'https://itnrlxfbejgxbibezoup.supabase.co';
    console.log('🌐 URL Supabase:', SUPABASE_URL);

    // Faire la requête à Supabase
    console.log('🔄 Appel à Supabase...');
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

    console.log('📨 Statut réponse Supabase:', response.status);
    
    const result = await response.json();
    console.log('📄 Réponse Supabase:', result);

    if (!response.ok) {
      if (response.status === 429) {
        console.log('❌ Rate limit Supabase');
        throw new Error('Trop de tentatives. Réessayez dans 1 heure.');
      }
      throw new Error(result.message || `Erreur ${response.status} de Supabase`);
    }

    console.log('✅ Succès - Email envoyé');
    return res.status(200).json({ 
      success: true, 
      message: 'Email de réinitialisation envoyé avec succès' 
    });

  } catch (error) {
    console.error('💥 Erreur API:', error);
    return res.status(500).json({ 
      error: error.message || 'Erreur interne du serveur'
    });
  }
}
