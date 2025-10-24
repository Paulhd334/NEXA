// /api/update-user-password.js
export default async function handler(req, res) {
  const { email, newPassword } = req.body;

  try {
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
    const SUPABASE_URL = 'https://itnrlxfbejgxbibezoup.supabase.co';

    // 1. Trouver l'user par email
    const userResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?email=${encodeURIComponent(email)}`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY
      }
    });

    if (!userResponse.ok) {
      throw new Error('Erreur recherche utilisateur');
    }

    const users = await userResponse.json();
    
    if (users.length === 0) {
      throw new Error('Utilisateur non trouvé');
    }

    const userId = users[0].id;

    // 2. Mettre à jour le mot de passe
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

    if (!updateResponse.ok) {
      const error = await updateResponse.json();
      throw new Error(error.message || 'Erreur mise à jour mot de passe');
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Mot de passe mis à jour avec succès' 
    });

  } catch (error) {
    return res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
}
