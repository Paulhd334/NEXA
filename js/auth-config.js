<script src="js/auth-config.js"></script>
<script>
    // Fonction pour afficher les messages d'alerte
    function showAlert(message, type) {
        const alertContainer = document.getElementById('alert-container');
        alertContainer.innerHTML = `
            <div class="alert alert-${type}">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
                ${message}
            </div>
        `;
        
        setTimeout(() => {
            alertContainer.innerHTML = '';
        }, 5000);
    }

    // 🔥 CONNEXION AVEC GOOGLE - VERSION OPTIMISÉE
    async function loginWithGoogle() {
        try {
            showAlert('<i class="fas fa-spinner fa-spin"></i> Connexion Google en cours...', 'success');
            
            const result = await authConfig.signInWithOAuth('google');
            
            if (!result.success) {
                showAlert(result.error, 'error');
            }
            // La redirection se fait automatiquement via Supabase

        } catch (error) {
            console.error('💥 Erreur connexion Google:', error);
            showAlert('Erreur lors de la connexion Google', 'error');
        }
    }

    // 🔥 CONNEXION AVEC GITHUB
    async function loginWithGitHub() {
        try {
            showAlert('<i class="fas fa-spinner fa-spin"></i> Connexion GitHub en cours...', 'success');
            
            const result = await authConfig.signInWithOAuth('github');
            
            if (!result.success) {
                showAlert(result.error, 'error');
            }

        } catch (error) {
            console.error('💥 Erreur connexion GitHub:', error);
            showAlert('Erreur lors de la connexion GitHub', 'error');
        }
    }

    // 🔥 CONNEXION EMAIL/MOT DE PASSE
    async function loginWithEmail(email, password) {
        try {
            console.log('🔐 Tentative de connexion email:', email);
            
            const { data, error } = await authConfig.supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;

            console.log('✅ Connexion réussie:', data.user.email);
            return { success: true, user: data.user };

        } catch (error) {
            console.error('❌ Erreur connexion:', error);
            
            let errorMessage = 'Erreur de connexion';
            
            if (error.message.includes('Invalid login credentials')) {
                errorMessage = 'Email ou mot de passe incorrect.';
            } else if (error.message.includes('Email not confirmed')) {
                errorMessage = 'Veuillez confirmer votre email avant de vous connecter.';
            } else if (error.message.includes('Too many requests')) {
                errorMessage = 'Trop de tentatives. Réessayez dans quelques minutes.';
            } else {
                errorMessage = error.message;
            }
            
            return { success: false, error: errorMessage };
        }
    }

    // Gestionnaire de formulaire
    document.getElementById('login-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        if (!email || !password) {
            showAlert('Veuillez remplir tous les champs.', 'error');
            return;
        }
        
        const submitBtn = document.getElementById('submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connexion...';
        
        const result = await loginWithEmail(email, password);
        
        if (result.success) {
            showAlert('✅ Connexion réussie ! Redirection...', 'success');
            
            // Stocker l'email si "Se souvenir de moi" est coché
            if (document.getElementById('remember').checked) {
                localStorage.setItem('rememberMe', 'true');
                localStorage.setItem('savedEmail', email);
            }
            
            // Redirection
            setTimeout(() => {
                window.location.href = 'account/account.html';
            }, 1500);
        } else {
            showAlert('❌ ' + result.error, 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });

    // Au chargement de la page
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🚀 Page login chargée');
        
        // Nettoyer les paramètres OAuth si présents
        authConfig.cleanOAuthParams();
        
        // Vérifier si l'utilisateur est déjà connecté
        authConfig.supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                console.log('✅ Utilisateur déjà connecté:', session.user.email);
                showAlert('Vous êtes déjà connecté. Redirection...', 'success');
                
                setTimeout(() => {
                    window.location.href = 'account/account.html';
                }, 1500);
            }
        });

        // Charger l'email si "Se souvenir de moi" était coché
        const rememberMe = localStorage.getItem('rememberMe');
        const savedEmail = localStorage.getItem('savedEmail');
        
        if (rememberMe === 'true' && savedEmail) {
            document.getElementById('remember').checked = true;
            document.getElementById('email').value = savedEmail;
            document.getElementById('password').focus();
        } else {
            document.getElementById('email').focus();
        }
    });

    // Entrée pour soumettre le formulaire
    document.getElementById('password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('login-form').dispatchEvent(new Event('submit'));
        }
    });
</script>
