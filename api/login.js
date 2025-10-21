// api/login.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    try {
        const { email, password } = req.body;

        // Validation des données
        if (!email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis' });
        }

        // Ici, vous intégrerez votre logique d'authentification
        // Pour l'instant, simulation avec des données de test
        const validEmail = 'test@nexa.com';
        const validPassword = 'password123';

        if (email === validEmail && password === validPassword) {
            // Simulation d'un utilisateur
            const user = {
                id: 1,
                email: email,
                username: 'nexa_player',
                first_name: 'Utilisateur',
                last_name: 'NEXA',
                created_at: new Date().toISOString()
            };

            // Simulation d'un token JWT
            const token = 'simulated_jwt_token_' + Date.now();

            return res.status(200).json({
                success: true,
                user: user,
                token: token,
                message: 'Connexion réussie'
            });
        } else {
            return res.status(401).json({ error: 'Identifiants invalides' });
        }

    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        return res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}