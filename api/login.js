// login.js sécurisé pour le frontend

// Clé ANON seulement (public)
const SUPABASE_URL = 'https://itnrlxfbejgxbibezoup.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0bnJseGZiZWpneGJpYmV6b3VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5NDgwODEsImV4cCI6MjA3NjUyNDA4MX0.0Ztl75n24jvOv0zGRvLSFGMmc0hQ3eoiZDwDrIrWKZ4';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Affichage des alertes
function showAlert(message, type) {
    const successAlert = document.getElementById('success-alert');
    const errorAlert = document.getElementById('error-alert');

    successAlert.style.display = 'none';
    errorAlert.style.display = 'none';

    if (type === 'success') {
        successAlert.textContent = message;
        successAlert.style.display = 'block';
    } else {
        errorAlert.textContent = message;
        errorAlert.style.display = 'block';
    }

    setTimeout(() => {
        successAlert.style.display = 'none';
        errorAlert.style.display = 'none';
    }, 5000);
}

// Connexion sécurisée
async function loginUser(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return { success: true, user: data.user };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

// Formulaire de connexion
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Connexion en cours...';

    const result = await loginUser(email, password);

    if (result.success) {
        showAlert('Connexion réussie ! Redirection...', 'success');
        setTimeout(() => window.location.href = 'account.html', 2000);
    } else {
        showAlert(result.error.includes('Invalid login credentials') ? 'Email ou mot de passe incorrect.' : result.error, 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Se connecter';
    }
});

// Vérification si déjà connecté
document.addEventListener('DOMContentLoaded', async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) window.location.href = 'account.html';
});

// Mot de passe oublié (frontend seulement)
document.querySelector('.forgot-password').addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    if (!email) return showAlert('Veuillez entrer votre email.', 'error');

    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password.html`
        });
        if (error) throw error;
        showAlert(`Email de réinitialisation envoyé à ${email}`, 'success');
    } catch (err) {
        showAlert(err.message, 'error');
    }
});
