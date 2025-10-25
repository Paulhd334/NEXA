// js/auth-config.js
class AuthConfig {
    constructor() {
        this.SUPABASE_URL = 'https://itnrlxfbejgxbibezoup.supabase.co';
        this.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0bnJseGZiZWpneGJpYmV6b3VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5NDgwODEsImV4cCI6MjA3NjUyNDA4MX0.0Ztl75n24jvOv0zGRvLSFGMmc0hQ3eoiZDwDrIrWKZ4';
        this.supabase = window.supabase.createClient(this.SUPABASE_URL, this.SUPABASE_ANON_KEY);
        this.REDIRECT_URL = 'https://nexa-neon.vercel.app/account/account.html';
    }

    // Méthode OAuth optimisée pour Google
    async signInWithGoogle() {
        try {
            console.log('🔐 Début de la connexion Google...');
            console.log('📍 URL de redirection:', this.REDIRECT_URL);
            
            const { data, error } = await this.supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: this.REDIRECT_URL,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent'
                    }
                }
            });

            if (error) {
                console.error('❌ Erreur Google OAuth:', error);
                throw error;
            }

            console.log('✅ Redirection Google initiée');
            return { success: true };

        } catch (error) {
            console.error('💥 Erreur connexion Google:', error);
            return { 
                success: false, 
                error: this.getErrorMessage(error) 
            };
        }
    }

    // Méthode pour GitHub aussi
    async signInWithGitHub() {
        try {
            console.log('🔐 Début de la connexion GitHub...');
            
            const { data, error } = await this.supabase.auth.signInWithOAuth({
                provider: 'github',
                options: {
                    redirectTo: this.REDIRECT_URL
                }
            });

            if (error) throw error;

            console.log('✅ Redirection GitHub initiée');
            return { success: true };

        } catch (error) {
            console.error('💥 Erreur connexion GitHub:', error);
            return { 
                success: false, 
                error: 'Erreur de connexion avec GitHub: ' + error.message 
            };
        }
    }

    getErrorMessage(error) {
        if (error.message.includes('oauth_callback_error')) {
            return 'La connexion a expiré. Veuillez réessayer.';
        }
        if (error.message.includes('provider_disabled')) {
            return 'Cette méthode de connexion n\'est pas activée.';
        }
        if (error.message.includes('redirect_uri')) {
            return 'Problème de configuration. Vérifiez les URLs de redirection dans Supabase.';
        }
        return 'Erreur de connexion: ' + error.message;
    }

    // Vérifier la session utilisateur
    async getCurrentUser() {
        try {
            const { data: { user }, error } = await this.supabase.auth.getUser();
            if (error) throw error;
            return user;
        } catch (error) {
            console.error('Erreur récupération utilisateur:', error);
            return null;
        }
    }

    async getSession() {
        try {
            const { data: { session }, error } = await this.supabase.auth.getSession();
            if (error) throw error;
            return session;
        } catch (error) {
            console.error('Erreur récupération session:', error);
            return null;
        }
    }

    // Déconnexion
    async signOut() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Erreur déconnexion:', error);
            return { success: false, error: error.message };
        }
    }

    // Vérifier si on a des paramètres OAuth dans l'URL
    hasOAuthParams() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.has('code') || urlParams.has('error');
    }

    // Nettoyer les paramètres OAuth
    cleanOAuthParams() {
        if (this.hasOAuthParams()) {
            const cleanUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
            console.log('🧹 Paramètres OAuth nettoyés');
        }
    }
}

// Initialisation globale
window.authConfig = new AuthConfig();
