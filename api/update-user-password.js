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
      console.error('❌ SUPABASE_SERVICE_KEY manquante');
      return res.status(500).json({ error: 'Configuration manquante' });
    }

    console.log('🔑 Service Key présente');
    console.log('🌐 URL Supabase:', SUPABASE_URL);

    // 1. Trouver l'user par email - VERSION DEBUG
    console.log('🔍 Recherche utilisateur:', email);
    
    const searchUrl = `${SUPABASE_URL}/auth/v1/admin/users?email=${encodeURIComponent(email)}`;
    console.log('📡 URL de recherche:', searchUrl);
    
    const userResponse = await fetch(searchUrl, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY
      }
    });

    console.log('📨 Statut réponse recherche user:', userResponse.status);
    console.log('📨 Headers réponse:', userResponse.headers);

    const responseText = await userResponse.text();
    console.log('📄 Réponse brute:', responseText);

    let users;
    try {
      users = JSON.parse(responseText);
      console.log('👤 Données utilisateurs parsées:', users);
    } catch (parseError) {
      console.error('❌ Erreur parsing JSON:', parseError);
      throw new Error('Réponse invalide de Supabase');
    }
    
    // Vérification plus robuste
    if (!users || !Array.isArray(users) || users.length === 0) {
      console.error('❌ Aucun utilisateur trouvé dans Supabase');
      
      // Vérifier dans la table public.users si vous en avez une
      console.log('🔍 Recherche dans la table public.users...');
      const { data: publicUsers, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email);
      
      console.log('👤 Utilisateurs table public:', publicUsers);
      
      return res.status(404).json({ 
        success: false,
        error: `Aucun utilisateur trouvé avec l'email: ${email}`,
        debug: {
          supabaseAuthUsers: users,
          publicTableUsers: publicUsers
        }
      });
    }

    const user = users[0];
    if (!user || !user.id) {
      console.error('❌ Utilisateur sans ID:', user);
      return res.status(404).json({ 
        success: false,
        error: 'Données utilisateur incomplètes' 
      });
    }

    const userId = user.id;
    console.log('🆔 ID utilisateur trouvé:', userId);

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

    console.log('📨 Statut réponse update:', updateResponse.status);

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error('❌ Erreur update:', errorText);
      throw new Error(`Erreur mise à jour: ${updateResponse.status}`);
    }

    const result = await updateResponse.json();
    console.log('✅ Mot de passe mis à jour avec succès:', result);

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
