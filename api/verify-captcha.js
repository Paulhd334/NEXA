// api/verify-captcha.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ 
                success: false, 
                error: 'Token hCaptcha manquant' 
            });
        }

        // 🔥 CLÉ SECRÈTE DANS LES VARIABLES D'ENVIRONNEMENT
        const secretKey = process.env.HCAPTCHA_SECRET_KEY;

        if (!secretKey) {
            console.error('❌ HCAPTCHA_SECRET_KEY non configurée');
            return res.status(500).json({
                success: false,
                error: 'Configuration serveur manquante'
            });
        }

        // Vérification avec hCaptcha
        const verificationResponse = await fetch('https://hcaptcha.com/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'secret': secretKey,
                'response': token,
                'sitekey': 'c7883208-55f0-440a-9546-115ceb60ff64' // Votre sitekey publique
            })
        });

        const verificationData = await verificationResponse.json();

        console.log('📊 Réponse hCaptcha:', verificationData);

        if (verificationData.success) {
            return res.status(200).json({ 
                success: true,
                data: verificationData
            });
        } else {
            return res.status(400).json({
                success: false,
                error: 'Vérification anti-robot échouée',
                details: verificationData['error-codes'] || []
            });
        }

    } catch (error) {
        console.error('❌ Erreur vérification hCaptcha:', error);
        return res.status(500).json({
            success: false,
            error: 'Erreur interne du serveur'
        });
    }
}
