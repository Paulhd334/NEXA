// /api/confirm-supabase-email.js - VERSION AMÉLIORÉE
const SUPABASE_URL = 'https://itnrlxfbejgxbibezoup.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0bnJseGZiZWpneGJpYmV6b3VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5NDgwODEsImV4cCI6MjA3NjUyNDA4MX0.0Ztl75n24jvOv0zGRvLSFGMmc0hQ3eoiZDwDrIrWKZ4';

export default async function handler(request, response) {
    console.log('🚀 API confirm-supabase-email.js appelée - VERSION DEBUG');
    
    // CORS headers
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight
    if (request.method === 'OPTIONS') {
        return response.status(200).end();
    }

    if (request.method !== 'POST') {
        return response.status(405).json({ 
            success: false,
            error: 'Méthode non autorisée' 
        });
    }

    try {
        console.log('📨 Corps de la requête reçu');
        const { email, token } = request.body;

        console.log('🎯 DÉBUT DEBUG COMPLET');
        console.log('📧 Email reçu:', email);
        console.log('🔐 Token reçu:', token);
        console.log('🔐 Type du token:', typeof token);
        console.log('🔐 Longueur du token:', token?.length);

        // VALIDATION
        if (!email) {
            return response.status(400).json({ 
                success: false,
                error: 'Email requis' 
            });
        }

        if (!token) {
            return response.status(400).json({ 
                success: false,
                error: 'Token requis' 
            });
        }

        // DÉCODAGE BASE64 SI NÉCESSAIRE
        let actualToken = token;
        
        // Méthode 1: Vérifier si c'est du base64
        try {
            const decoded = Buffer.from(token, 'base64').toString('utf8');
            console.log('🔓 Tentative de décodage base64:', decoded);
            
            // Si le décodage produit quelque chose de valide et différent de l'original
            if (decoded && decoded !== token && decoded.length > 0) {
                actualToken = decoded;
                console.log('✅ Token décodé base64 avec succès');
            }
        } catch (e) {
            console.log('ℹ️ Token non base64');
        }

        console.log('🎯 Token final utilisé:', actualToken);
        console.log('🎯 Longueur token final:', actualToken.length);

        // 1. RECHERCHE DU TOKEN DANS LA BASE
        console.log('🔍 Recherche du token dans Supabase...');
        
        const searchUrl = `${SUPABASE_URL}/rest/v1/user_confirmation_tokens?email=eq.${encodeURIComponent(email)}&confirmation_token=eq.${encodeURIComponent(actualToken)}&used=eq.false`;
        console.log('🔍 URL de recherche:', searchUrl);

        const tokenCheck = await fetch(searchUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });

        console.log(`📊 Statut de la réponse: ${tokenCheck.status}`);
        console.log(`📊 OK?: ${tokenCheck.ok}`);

        if (!tokenCheck.ok) {
            const errorText = await tokenCheck.text();
            console.error('❌ Erreur Supabase:', errorText);
            return response.status(500).json({
                success: false,
                error: 'Erreur de vérification du token',
                details: errorText
            });
        }

        const tokens = await tokenCheck.json();
        console.log(`📋 Nombre de tokens trouvés: ${tokens.length}`);

        if (tokens.length === 0) {
            console.log('❌ Aucun token valide trouvé');
            
            // DEBUG: Rechercher tous les tokens pour cet email
            console.log('🔍 DEBUG: Recherche de tous les tokens pour cet email...');
            const allTokensUrl = `${SUPABASE_URL}/rest/v1/user_confirmation_tokens?email=eq.${encodeURIComponent(email)}&select=*`;
            const allTokensResponse = await fetch(allTokensUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                }
            });
            
            if (allTokensResponse.ok) {
                const allTokens = await allTokensResponse.json();
                console.log('🔍 Tous les tokens trouvés pour cet email:', allTokens);
            }
            
            return response.status(400).json({ 
                success: false,
                error: 'Token invalide, expiré ou déjà utilisé' 
            });
        }

        const foundToken = tokens[0];
        console.log('✅ Token valide trouvé:', {
            id: foundToken.id,
            email: foundToken.email,
            token: foundToken.confirmation_token,
            expires_at: foundToken.expires_at,
            used: foundToken.used
        });

        // VÉRIFICATION EXPIRATION
        const now = new Date();
        const expiresAt = new Date(foundToken.expires_at);
        console.log('⏰ Date actuelle:', now.toISOString());
        console.log('⏰ Expiration token:', expiresAt.toISOString());
        console.log('⏰ Token expiré?:', now > expiresAt);

        if (now > expiresAt) {
            console.log('❌ Token expiré');
            return response.status(400).json({ 
                success: false,
                error: 'Token expiré' 
            });
        }

        // MARQUER LE TOKEN COMME UTILISÉ
        console.log('🔄 Marquage du token comme utilisé...');
        const markUsedResponse = await fetch(
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

        if (!markUsedResponse.ok) {
            console.warn('⚠️ Impossible de marquer le token comme utilisé');
        } else {
            console.log('✅ Token marqué comme utilisé');
        }

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
            error: 'Erreur serveur lors de la confirmation',
            details: error.message
        });
    }
}
