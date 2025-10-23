// Fonction pour stocker le token AVEC USER_ID
async function storeConfirmationToken(email, token) {
    try {
        console.log('💾 Stockage du token pour:', email);
        
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        const userId = generateSimpleUUID(); // Générer un user_id
        
        const tokenData = {
            id: generateSimpleUUID(),
            user_id: userId, // FOURNIR user_id requis
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
            return false;
        }

        console.log('✅ Token stocké avec succès');
        return true;
        
    } catch (error) {
        console.warn('⚠️ Erreur stockage token:', error);
        return false;
    }
}

// Fonction pour générer un UUID simple
function generateSimpleUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
