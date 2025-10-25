// js/auth-handler.js
class AuthHandler {
    constructor() {
        this.SUPABASE_URL = 'https://itnrlxfbejgxbibezoup.supabase.co';
        this.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0bnJseGZiZWpneGJpYmV6b3VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5NDgwODEsImV4cCI6MjA3NjUyNDA4MX0.0Ztl75n24jvOv0zGRvLSFGMmc0hQ3eoiZDwDrIrWKZ4';
        this.supabase = window.supabase.createClient(this.SUPABASE_URL, this.SUPABASE_ANON_KEY);
        this.init();
    }

    init() {
        console.log('🔑 AuthHandler initialisé');
        this.setupEventListeners();
        this.handleAuthRedirect();
    }

    // Gestion spéciale des redirections OAuth
    async handleAuthRedirect() {
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');
        const code = urlParams.get('code');

        // Si erreur OAuth détectée
        if (error) {
            await this.handleOAuthError(error, urlParams.get('error_description'));
            return;
        }

        // Si code OAuth présent, laisser Supabase le traiter
        if (code) {
            console.log('🔄 Traitement du code OAuth...');
            // Supabase gère automatiquement l'échange du code
            return;
        }

        // Sinon, vérifier la session normale
        await this.checkSession();
    }

    async handleOAuthError(error, errorDescription) {
        console.error('🚨 Erreur OAuth:', error, errorDescription);

        // Nettoyer l'URL IMMÉDIATEMENT
        this.cleanURL();

        let message = 'Erreur d\'authentification. ';
        let redirectToLogin = false;

        if (errorDescription?.includes('Unable to exchange external code')) {
            message = 'La session d\'authentification a expiré. Veuillez vous reconnecter.';
            redirectToLogin = true;
        } else if (errorDescription?.includes('already exists')) {
            message = 'Ce compte est déjà lié à un autre utilisateur.';
        } else {
            message = 'Problème d\'authentification. Veuillez réessayer.';
            redirectToLogin = true;
        }

        this.showAlert(message, 'error');

        if (redirectToLogin) {
            setTimeout(() => {
                window.location.href = 'login.html?auth_retry=true';
            }, 2500);
        }
    }

    async checkSession() {
        try {
            const { data: { session }, error } = await this.supabase.auth.getSession();
            
            if (error) {
                throw error;
            }

            if (session) {
                this.handleAuthenticatedUser(session.user);
            } else {
                this.handleUnauthenticatedUser();
            }
        } catch (error) {
            console.error('❌ Erreur de session:', error);
            this.handleUnauthenticatedUser();
        }
    }

    handleAuthenticatedUser(user) {
        console.log('✅ Utilisateur authentifié:', user);
        this.updateUI(user);
        this.showAlert('Connexion réussie!', 'success');
        
        // Masquer le message de connexion requise
        const loginRequired = document.getElementById('login-required');
        const userContent = document.getElementById('user-content');
        if (loginRequired) loginRequired.style.display = 'none';
        if (userContent) userContent.style.display = 'block';
    }

    handleUnauthenticatedUser() {
        console.log('👤 Utilisateur non authentifié');
        
        // Afficher le message de connexion requise
        const loginRequired = document.getElementById('login-required');
        const userContent = document.getElementById('user-content');
        if (loginRequired) loginRequired.style.display = 'block';
        if (userContent) userContent.style.display = 'none';
    }

    cleanURL() {
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
    }

    showAlert(message, type) {
        const alertContainer = document.getElementById('alert-container');
        if (!alertContainer) return;

        alertContainer.innerHTML = `
            <div class="alert alert-${type}">
                <i class="fas fa-${type === 'success' ? 'check' : 'exclamation-triangle'}"></i>
                ${message}
            </div>
        `;

        setTimeout(() => {
            alertContainer.innerHTML = '';
        }, 5000);
    }

    updateUI(user) {
        // Mettre à jour le profil utilisateur
        const username = user.user_metadata?.username || user.email || 'Utilisateur';
        const userInitial = username.charAt(0).toUpperCase();

        const elements = {
            'user-name': username,
            'user-email': user.email || 'Non spécifié',
            'user-avatar': userInitial,
            'email': user.email || '',
            'username': user.user_metadata?.username || ''
        };

        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                if (element.type === 'email' || element.type === 'text') {
                    element.value = elements[id];
                } else {
                    element.textContent = elements[id];
                }
            }
        });

        // Mettre à jour les statistiques
        const stats = {
            'playtime': '125min',
            'achievements': '8',
            'member-since': new Date(user.created_at).toLocaleDateString('fr-FR'),
            'player-level': '3'
        };

        Object.keys(stats).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = stats[id];
            }
        });
    }

    async logout() {
        try {
            this.showAlert('Déconnexion en cours...', 'success');
            
            const { error } = await this.supabase.auth.signOut();
            if (error) throw error;

            this.showAlert('Déconnexion réussie', 'success');
            
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1500);
            
        } catch (error) {
            console.error('Erreur de déconnexion:', error);
            this.showAlert('Erreur lors de la déconnexion', 'error');
        }
    }

    setupEventListeners() {
        // Boutons de déconnexion
        ['logout-btn', 'mobile-logout-btn'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', () => this.logout());
            }
        });

        // Formulaire de profil
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => this.handleProfileUpdate(e));
        }
    }

    async handleProfileUpdate(e) {
        e.preventDefault();
        
        const usernameInput = document.getElementById('username');
        if (!usernameInput) return;

        const username = usernameInput.value.trim();
        
        if (!username) {
            this.showAlert('Veuillez saisir un nom d\'utilisateur', 'error');
            return;
        }
        
        try {
            this.showAlert('Mise à jour du profil en cours...', 'success');
            
            const { data: { user }, error } = await this.supabase.auth.updateUser({
                data: { username: username }
            });

            if (error) throw error;
            
            this.updateUI(user);
            this.showAlert('Profil mis à jour avec succès', 'success');
            
        } catch (error) {
            console.error('Erreur mise à jour profil:', error);
            this.showAlert('Erreur lors de la mise à jour: ' + error.message, 'error');
        }
    }
}

// Initialisation quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    window.authHandler = new AuthHandler();
});
