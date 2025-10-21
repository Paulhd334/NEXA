import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // Clé service Supabase

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

    const { firstname, lastname, username, email, password } = req.body;

    try {
        // Création utilisateur avec Service Key (sécurisé)
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            user_metadata: { firstname, lastname, username }
        });
        if (authError) throw authError;

        // Création du profil dans la table 'profiles'
        await supabase.from('profiles').insert({
            id: authData.user.id,
            username,
            first_name: firstname,
            last_name: lastname,
            email,
            created_at: new Date().toISOString()
        });

        res.status(200).json({ success: true, user: authData.user });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}
