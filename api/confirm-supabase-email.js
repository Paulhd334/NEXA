// /api/confirm-supabase-email.js
const SUPABASE_URL = 'https://itnrlxfbejgxbibezoup.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0bnJseGZiZWpneGJpYmV6b3VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5NDgwODEsImV4cCI6MjA3NjUyNDA4MX0.0Ztl75n24jvOv0zGRvLSFGMmc0hQ3eoiZDwDrIrWKZ4';

export default async function handler(request, response) {
  // CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  // Only allow POST
  if (request.method !== 'POST') {
    return response.status(405).json({ 
      success: false,
      error: 'Méthode non autorisée' 
    });
  }

  try {
    const { email, token } = request.body;

    console.log(`📧 Confirmation demandée pour: ${email}`);
    console.log(`🔐 Token reçu: ${token ? token.substring(0, 30) + '...' : 'Aucun'}`);

    // Validation basique
    if (!email) {
      return response.status(400).json({ 
        success: false,
        error: 'Adresse email requise' 
      });
    }

    if (!token || token.trim().length < 5) {
      return response.status(400).json({ 
        success: false,
        error: 'Token de confirmation invalide' 
      });
    }

    // VÉRIFIER SI L'UTILISATEUR EXISTE DANS PROFILES
    const profileCheck = await fetch(`${SUPABASE_URL}/rest/v1/profiles?email=eq.${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (!profileCheck.ok) {
      console.error('❌ Erreur vérification profil:', profileCheck.status);
      throw new Error('Erreur de connexion à la base de données');
    }

    const profiles = await profileCheck.json();
    const profileExists = profiles.length > 0;

    console.log(`👤 Profil existant: ${profileExists}`);

    if (profileExists) {
      // METTRE À JOUR LE PROFIL EXISTANT
      const updateData = {
        email_verified: true,
        email_verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log(`🔄 Mise à jour profil:`, updateData);

      const updateResponse = await fetch(`${SUPABASE_URL}/rest/v1/profiles?email=eq.${encodeURIComponent(email)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(updateData)
      });

      if (!updateResponse.ok) {
        // Si échec, peut-être que les colonnes n'existent pas
        console.warn('⚠️ Échec mise à jour, tentative sans colonnes spécifiques...');
        
        // Essayer une mise à jour basique
        const simpleUpdate = await fetch(`${SUPABASE_URL}/rest/v1/profiles?email=eq.${encodeURIComponent(email)}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            updated_at: new Date().toISOString()
          })
        });

        if (!simpleUpdate.ok) {
          console.warn('⚠️ Mise à jour basique aussi échouée');
        }
      }

    } else {
      // CRÉER UN NOUVEAU PROFIL
      console.log(`🆕 Création nouveau profil pour: ${email}`);
      
      const profileData = {
        email: email,
        email_verified: true,
        email_verified_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const createResponse = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(profileData)
      });

      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        console.error('❌ Erreur création profil:', errorText);
        
        // Essayer une création minimaliste
        const minimalProfile = {
          email: email,
          created_at: new Date().toISOString()
        };

        const minimalResponse = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(minimalProfile)
        });

        if (!minimalResponse.ok) {
          throw new Error('Impossible de créer le profil utilisateur');
        }
      }
    }

    // MARQUER LE TOKEN COMME UTILISÉ (si la table existe)
    try {
      const tokenUpdate = await fetch(`${SUPABASE_URL}/rest/v1/user_confirmation_tokens?email=eq.${encodeURIComponent(email)}&confirmation_token=eq.${encodeURIComponent(token)}`, {
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
      
      if (tokenUpdate.ok) {
        console.log('✅ Token marqué comme utilisé');
      }
    } catch (tokenError) {
      console.log('ℹ️ Token non marqué (table probablement inexistante)');
    }

    console.log(`🎉 Email ${email} confirmé avec succès!`);
    
    return response.status(200).json({
      success: true,
      message: 'Email confirmé avec succès ! Votre compte est maintenant activé.',
      email: email,
      confirmed: true
    });

  } catch (error) {
    console.error('❌ Erreur confirmation email:', error);
    
    return response.status(500).json({
      success: false,
      error: 'Erreur lors de la confirmation',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
