<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Inscription réussie - NEXA</title>
    <style>
        body {
            background: #0a0a0a;
            color: white;
            font-family: 'Inter', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .success-container {
            text-align: center;
            padding: 40px;
            background: #1a1a1a;
            border-radius: 12px;
            border: 1px solid #333;
        }
        .spinner {
            border: 4px solid #333;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="success-container">
        <h1>🎉 Inscription réussie !</h1>
        <p>Votre compte a été créé avec succès.</p>
        <p>Redirection vers votre espace personnel...</p>
        <div class="spinner"></div>
    </div>

    <script type="module">
        import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
        
        const supabase = createClient(
            'https://itnrlxfbejgxbibezoup.supabase.co',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0bnJseGZiZWpneGJpYmV6b3VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5NDgwODEsImV4cCI6MjA3NjUyNDA4MX0.0Ztl75n24jvOv0zGRvLSFGMmc0hQ3eoiZDwDrIrWKZ4'
        );

        async function handleAuthSuccess() {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                
                if (error) throw error;
                
                if (session?.user) {
                    console.log('✅ Utilisateur connecté:', session.user.email);
                    
                    // Redirection vers la page de compte après 2 secondes
                    setTimeout(() => {
                        window.location.href = '/account/account.html';
                    }, 2000);
                } else {
                    // Si pas de session, retour à l'inscription
                    setTimeout(() => {
                        window.location.href = '/create-account.html';
                    }, 2000);
                }
            } catch (error) {
                console.error('Erreur:', error);
                setTimeout(() => {
                    window.location.href = '/create-account.html';
                }, 2000);
            }
        }

        handleAuthSuccess();
    </script>
</body>
</html>
