// /api/confirm-supabase-email.js - VERSION FONCTIONNELLE
const SUPABASE_URL = 'https://itnrlxfbejgxbibezoup.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0bnJseGZiZWpneGJpYmV6b3VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5NDgwODEsImV4cCI6MjA3NjUyNDA4MX0.0Ztl75n24jvOv0zGRvLSFGMmc0hQ3eoiZDwDrIrWKZ4';

// Fonction pour générer un UUID simple
function generateSimpleUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Gestionnaire principal
export default async function handler(request, response) {
    console.log('🚀 API confirm-supabase-email.js appelée');
    
    // CORS headers
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight
    if (request.method === 'OPTIONS') {
        console.log('🔄 Requête OPTIONS reçue');
        return response.status(200).end();
    }

    // Vérifier la méthode
    if (request.method !== 'POST') {
        console.log('❌ Méthode non autorisée:', request.method);
        return response.status(405).json({ 
            success: false,
            error: 'Méthode non autorisée' 
        });
    }

    try {
        console.log('📨 Corps de la requête reçu');
        
        // Lire le corps de la requête
        let body;
        try {
            body = request.body;
            console.log('📝 Corps brut:', typeof body, body);
        } catch (parseError) {
            console.error('❌ Erreur parsing JSON:', parseError);
            return response.status(400).json({
                success: false,
                error: 'Données JSON invalides'
            });
        }

        const { email, token } = body;

        console.log(`🎯 Confirmation demandée pour: ${email}`);
        console.log(`🔐 Token reçu: ${token ? token.substring(0, 20) + '...' : 'AUCUN'}`);

        // Validation de base
        if (!email) {
            console.log('❌ Email manquant');
            return response.status(400).json({ 
                success: false,
                error: 'Email requis' 
            });
        }

        if (!token) {
            console.log('❌ Token manquant');
            return response.status(400).json({ 
                success: false,
                error: 'Token requis' 
            });
        }

        // 1. VÉRIFIER SI LE TOKEN EXISTE
        console.log(`🔍 Recherche du token pour: ${email}`);
        
        const tokenCheck = await fetch(
            `${SUPABASE_URL}/rest/v1/user_confirmation_tokens?email=eq.${encodeURIComponent(email)}&confirmation_token=eq.${encodeURIComponent(token)}&used=eq.false`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                }
            }
        );

        console.log(`📊 Statut vérification token: ${tokenCheck.status}`);

        if (!tokenCheck.ok) {
            console.error(`❌ Erreur API Supabase: ${tokenCheck.status}`);
            let errorText = 'Erreur inconnue';
            try {
                errorText = await tokenCheck.text();
            } catch (e) {
                console.error('Impossible de lire erreur');
            }
            
            return response.status(500).json({
                success: false,
                error: 'Erreur de vérification du token',
                details: `Code: ${tokenCheck.status}`
            });
        }

        const tokens = await tokenCheck.json();
        console.log(`📋 Tokens trouvés: ${tokens.length}`);

        // Vérifier si le token est valide
        if (tokens.length === 0) {
            console.log(`❌ Aucun token valide trouvé`);
            return response.status(400).json({ 
                success: false,
                error: 'Token invalide, expiré ou déjà utilisé' 
            });
        }

        const foundToken = tokens[0];
        console.log(`✅ Token valide trouvé:`, {
            id: foundToken.id,
            email: foundToken.email,
            expires_at: foundToken.expires_at,
            used: foundToken.used
        });

        // Vérifier l'expiration
        const now = new Date();
        const expiresAt = new Date(foundToken.expires_at);
        if (now > expiresAt) {
            console.log(`❌ Token expiré: ${expiresAt}`);
            return response.status(400).json({ 
                success: false,
                error: 'Token expiré' 
            });
        }

        // 2. MARQUER LE TOKEN COMME UTILISÉ
        console.log(`🔄 Marquage du token comme utilisé...`);
        
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
            console.warn(`⚠️ Impossible de marquer le token comme utilisé: ${markUsedResponse.status}`);
        } else {
            console.log(`✅ Token marqué comme utilisé`);
        }

        console.log(`🎉 CONFIRMATION RÉUSSIE pour ${email}!`);
        
        // Réponse de succès
        return response.status(200).json({
            success: true,
            message: 'Email confirmé avec succès ! Votre compte est maintenant activé.',
            email: email,
            confirmed: true,
            timestamp: now.toISOString()
        });

    } catch (error) {
        console.error('❌ ERREUR CRITIQUE:', error);
        
        // Réponse d'erreur en JSON
        return response.status(500).json({
            success: false,
            error: 'Erreur serveur lors de la confirmation',
            details: error.message
        });
    }
}
