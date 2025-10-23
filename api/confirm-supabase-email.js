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
    const { email } = request.body;

    if (!email) {
      return response.status(400).json({ error: 'Email requis' });
    }

    console.log(`✅ Confirmation Supabase pour: ${email}`);

    // Ici vous marquez l'email comme confirmé dans votre table users
    const updateResponse = await fetch(`${SUPABASE_URL}/rest/v1/users?email=eq.${email}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        email_confirmed: true,
        confirmed_at: new Date().toISOString()
      })
    });

    if (!updateResponse.ok) {
      throw new Error(`Erreur Supabase: ${updateResponse.status}`);
    }

    console.log(`✅ Email ${email} confirmé dans Supabase`);
    
    return response.status(200).json({
      success: true,
      message: 'Email confirmé avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur confirmation Supabase:', error);
    return response.status(500).json({
      error: 'Erreur lors de la confirmation',
      details: error.message
    });
  }
}