// /api/update-user-password.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { email, newPassword } = req.body;
    
    console.log('🔄 Update password request:', { email, hasPassword: !!newPassword });

    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
    const SUPABASE_URL = 'https://itnrlxfbejgxbibezoup.supabase.co';

    if (!SUPABASE_SERVICE_KEY) {
      throw new Error('Configuration manquante: SUPABASE_SERVICE_KEY');
    }

    // 1. Trouver l'user par email
    console.log('🔍 Recherche utilisateur...');
    const userResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?email=${encodeURIComponent(email)}`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY
      }
    });

    console.log('📨 Réponse recherche user:', userResponse.status);

    if (!userResponse.ok) {
      const error = await userResponse.json();
      throw new Error(`Erreur recherche utilisateur: ${error.message || userResponse.status}`);
    }

    const users = await userResponse.json();
    console.log('👤 Utilisateurs trouvés:', users);
    
    if (!users || users.length === 0) {
      throw new Error('Utilisateur non trouvé');
    }

    const userId = users[0].id;
    console.log('🆔 ID utilisateur:', userId);

    // 2. Mettre à jour le mot de passe
    console.log('🔄 Mise à jour du mot de passe...');
    const updateResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY
      },
      body: JSON.stringify({
        password: newPassword
      })
    });

    console.log('📨 Réponse update:', updateResponse.status);

    if (!updateResponse.ok) {
      const error = await updateResponse.json();
      throw new Error(`Erreur mise à jour: ${error.message || updateResponse.status}`);
    }

    const result = await updateResponse.json();
    console.log('✅ Mot de passe mis à jour avec succès');

    return res.status(200).json({ 
      success: true, 
      message: 'Mot de passe mis à jour avec succès' 
    });

  } catch (error) {
    console.error('💥 Erreur API update-user-password:', error);
    return res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
}
