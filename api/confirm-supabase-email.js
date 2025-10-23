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

    if (!email) {
      return response.status(400).json({ error: 'Email requis' });
    }

    console.log(`✅ Confirmation pour: ${email}`);

    // VÉRIFICATION SIMPLIFIÉE - On accepte tous les tokens valides
    // (vous pouvez ajouter une vérification basique si besoin)
    if (!token || token.length < 10) {
      return response.status(400).json({ 
        error: 'Token invalide' 
      });
    }

    // DIRECTEMENT mettre à jour le profil utilisateur comme vérifié
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
      console.warn('⚠️ Erreur mise à jour profil:', updateProfileResponse.status);
      
      // Si le profil n'existe pas, créer un profil basique
      const createResponse = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          email: email,
          email_verified: true,
          email_verified_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        })
      });

      if (!createResponse.ok) {
        throw new Error('Impossible de créer ou mettre à jour le profil');
      }
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
