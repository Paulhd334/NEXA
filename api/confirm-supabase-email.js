// /api/confirm-supabase-email.js - VERSION CORRIGÉE
const SUPABASE_URL = 'https://itnrlxfbejgxbibezoup.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0bnJseGZiZWpneGJpYmV6b3VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5NDgwODEsImV4cCI6MjA3NjUyNDA4MX0.0Ztl75n24jvOv0zGRvLSFGMmc0hQ3eoiZDwDrIrWKZ4';

export default async function handler(request, response) {
    console.log('🚀 API confirm-supabase-email.js - VERSION CORRIGÉE');
    
    // CORS
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (request.method === 'OPTIONS') return response.status(200).end();
    if (request.method !== 'POST') return response.status(405).json({ success: false, error: 'Méthode non autorisée' });

    try {
        const { email, token } = request.body;

        console.log('🔍 DEBUG:', { email, token });

        // VALIDATION
        if (!email || !token) {
            return response.status(400).json({ 
                success: false,
                error: 'Email et token requis' 
            });
        }

        // STRATÉGIE DE RECHERCHE MULTIPLE
        let foundToken = null;

        // Méthode 1: Recherche par email seulement (récupère le plus récent)
        console.log('🔍 Méthode 1: Recherche du token le plus récent...');
        const recentTokensUrl = `${SUPABASE_URL}/rest/v1/user_confirmation_tokens?email=eq.${encodeURIComponent(email)}&used=eq.false&order=created_at.desc&limit=1`;
        
        const recentResponse = await fetch(recentTokensUrl, {
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });

        if (recentResponse.ok) {
            const tokens = await recentResponse.json();
            if (tokens.length > 0) {
                foundToken = tokens[0];
                console.log('✅ Token le plus récent trouvé:', foundToken.confirmation_token);
            }
        }

        // Si pas trouvé, erreur
        if (!foundToken) {
            console.log('❌ Aucun token valide trouvé');
            return response.status(400).json({ 
                success: false,
                error: 'Aucun token de confirmation valide trouvé' 
            });
        }

        // VÉRIFICATION EXPIRATION
        const now = new Date();
        const expiresAt = new Date(foundToken.expires_at);
        
        if (now > expiresAt) {
            console.log('❌ Token expiré');
            return response.status(400).json({ 
                success: false,
                error: 'Token expiré' 
            });
        }

        // MARQUER COMME UTILISÉ
        console.log('🔄 Marquage du token comme utilisé...');
        await fetch(
            `${SUPABASE_URL}/rest/v1/user_confirmation_tokens?id=eq.${foundToken.id}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({
                    used: true,
                    used_at: now.toISOString()
                })
            }
        );

        console.log('🎉 CONFIRMATION RÉUSSIE!');
        
        return response.status(200).json({
            success: true,
            message: 'Email confirmé avec succès ! Votre compte est maintenant activé.',
            email: email,
            confirmed: true,
            timestamp: now.toISOString()
        });

    } catch (error) {
        console.error('❌ ERREUR CRITIQUE:', error);
        return response.status(500).json({
            success: false,
            error: 'Erreur serveur lors de la confirmation'
        });
    }
}
