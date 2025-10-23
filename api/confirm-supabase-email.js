// Fonction pour stocker le token CORRECTEMENT
async function storeConfirmationToken(email, token) {
    try {
        console.log('💾 Stockage du token pour:', email);
        
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        
        // Structure SIMPLIFIÉE sans user_id
        const tokenData = {
            email: email,
            confirmation_token: token,
            expires_at: expiresAt,
            used: false,
            created_at: new Date().toISOString()
        };

        console.log('📦 Données token:', tokenData);

        const response = await fetch(`${SUPABASE_URL}/rest/v1/user_confirmation_tokens`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(tokenData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.warn('⚠️ Erreur stockage token:', response.status, errorText);
            
            // Si c'est une erreur de colonne manquante, créer la table d'abord
            if (errorText.includes('column') && errorText.includes('does not exist')) {
                console.log('🔄 Structure de table incorrecte');
                return false;
            }
            return false;
        }

        console.log('✅ Token stocké avec succès');
        return true;
        
    } catch (error) {
        console.warn('⚠️ Erreur stockage token:', error);
        return false;
    }
}
