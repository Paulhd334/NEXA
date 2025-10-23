// /api/confirm-supabase-email.js
const SUPABASE_URL = 'https://itnrlxfbejgxbibezoup.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0bnJseGZiZWpneGJpYmV6b3VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5NDgwODEsImV4cCI6MjA3NjUyNDA4MX0.0Ztl75n24jvOv0zGRvLSFGMmc0hQ3eoiZDwDrIrWKZ4';

export default async function handler(request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { email, token } = request.body;

    if (!email || !token) {
      return response.status(400).json({ error: 'Email et token requis' });
    }

    console.log(`✅ Confirmation pour: ${email}`);

    // 1. Vérifier si le token est valide et non expiré
    const tokenCheck = await fetch(`${SUPABASE_URL}/rest/v1/user_confirmation_tokens?email=eq.${email}&confirmation_token=eq.${token}&used=eq.false&expires_at=gt.${new Date().toISOString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (!tokenCheck.ok) {
      throw new Error('Erreur de vérification du token');
    }

    const tokens = await tokenCheck.json();

    if (tokens.length === 0) {
      return response.status(400).json({ 
        error: 'Token invalide, expiré ou déjà utilisé' 
      });
    }

    // 2. Marquer le token comme utilisé
    const markUsedResponse = await fetch(`${SUPABASE_URL}/rest/v1/user_confirmation_tokens?email=eq.${email}&confirmation_token=eq.${token}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        used: true,
        used_at: new Date().toISOString()
      })
    });

    if (!markUsedResponse.ok) {
      throw new Error('Erreur lors du marquage du token');
    }

    // 3. Mettre à jour le profil utilisateur comme vérifié
    const updateProfileResponse = await fetch(`${SUPABASE_URL}/rest/v1/profiles?email=eq.${email}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        email_verified: true,
        email_verified_at: new Date().toISOString()
      })
    });

    if (!updateProfileResponse.ok) {
      console.warn('⚠️ Profil non mis à jour, mais token marqué comme utilisé');
    }

    console.log(`✅ Email ${email} confirmé avec succès`);
    
    return response.status(200).json({
      success: true,
      message: 'Email confirmé avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur confirmation:', error);
    return response.status(500).json({
      error: 'Erreur lors de la confirmation',
      details: error.message
    });
  }
}
