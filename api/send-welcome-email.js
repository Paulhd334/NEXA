// /api/send-welcome-email.js - VERSION PROFESSIONNELLE NOIR & BLANC
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://nexa-neon.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { user, user_metadata } = req.body;

    if (!user || !user.email) {
      return res.status(400).json({ error: 'Données utilisateur manquantes' });
    }

    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    
    if (!BREVO_API_KEY) {
      return res.status(500).json({ error: 'Service email non configuré' });
    }
    
    const emailData = {
      sender: {
        name: 'UNWARE STUDIO - NEXA',
        email: 'contact.unwarestudio@gmail.com'
      },
      to: [{
        email: user.email,
        name: user_metadata?.full_name || user.email.split('@')[0]
      }],
      subject: `NEXA - Confirmation de votre compte`,
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
              color: #000000; 
              margin: 0; 
              padding: 0; 
              background: #ffffff;
              line-height: 1.6;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background: #ffffff; 
              border: 1px solid #e0e0e0;
            }
            .header { 
              background: #000000; 
              color: #ffffff; 
              padding: 50px 40px 40px; 
              text-align: center; 
              border-bottom: 1px solid #333;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 700;
              letter-spacing: 2px;
              text-transform: uppercase;
            }
            .header p {
              margin: 15px 0 0 0;
              opacity: 0.8;
              font-size: 16px;
              font-weight: 400;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .content { 
              padding: 50px 40px; 
              color: #000000;
            }
            .content h2 {
              color: #000000;
              margin: 0 0 25px 0;
              font-size: 22px;
              font-weight: 600;
              border-bottom: 2px solid #000000;
              padding-bottom: 10px;
            }
            .content p {
              margin: 0 0 20px 0;
              color: #333333;
              font-size: 16px;
            }
            .user-info { 
              background: #f8f9fa; 
              padding: 30px; 
              margin: 30px 0; 
              border: 1px solid #e0e0e0;
            }
            .user-info h3 {
              margin: 0 0 20px 0;
              color: #000000;
              font-size: 16px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr;
              gap: 15px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #e0e0e0;
            }
            .info-label {
              font-weight: 600;
              color: #000000;
            }
            .info-value {
              color: #666666;
              text-align: right;
            }
            .cta-section {
              text-align: center;
              margin: 40px 0;
              padding: 40px;
              background: #f8f9fa;
              border: 1px solid #e0e0e0;
            }
            .cta-button {
              display: inline-block;
              background: #000000;
              color: #ffffff;
              padding: 16px 40px;
              text-decoration: none;
              font-weight: 600;
              font-size: 16px;
              border: none;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .note-box {
              background: #f8f9fa;
              padding: 20px;
              margin: 30px 0;
              border-left: 4px solid #000000;
              font-size: 14px;
              color: #666666;
            }
            .note-box strong {
              color: #000000;
              display: block;
              margin-bottom: 8px;
            }
            .footer { 
              background: #000000; 
              padding: 30px 40px; 
              text-align: center; 
              color: #ffffff;
              font-size: 12px;
            }
            .footer-links {
              margin: 15px 0;
            }
            .footer-links a {
              color: #ffffff;
              text-decoration: none;
              margin: 0 10px;
              opacity: 0.8;
            }
            .footer-links a:hover {
              opacity: 1;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>NEXA</h1>
              <p>Votre compte a été créé avec succès</p>
            </div>
            
            <div class="content">
              <h2>Bienvenue</h2>
              <p>Bonjour ${user_metadata?.full_name || 'Utilisateur'},</p>
              <p>Votre compte NEXA a été activé avec succès. Vous avez désormais accès à notre plateforme et serez informé du lancement du jeu.</p>
              
              <div class="user-info">
                <h3>Détails du compte</h3>
                <div class="info-grid">
                  <div class="info-row">
                    <span class="info-label">Nom complet</span>
                    <span class="info-value">${user_metadata?.full_name || 'Non spécifié'}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Adresse email</span>
                    <span class="info-value">${user.email}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Identifiant</span>
                    <span class="info-value">${user_metadata?.preferred_username || user.email.split('@')[0]}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Date d'inscription</span>
                    <span class="info-value">${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>

              <div class="note-box">
                <strong>À propos de NEXA</strong>
                NEXA est actuellement en développement. Vous serez notifié par email lorsque le jeu sera disponible au téléchargement. Votre compte est déjà configuré pour une expérience sans interruption le jour du lancement.
              </div>

              <div class="cta-section">
                <p style="margin-bottom: 25px; font-size: 18px; font-weight: 600;">ACCÉDER À VOTRE COMPTE</p>
                <a href="https://nexa-neon.vercel.app/account/account.html" class="cta-button">
                  Tableau de bord
                </a>
              </div>

              <div class="note-box">
                <strong>Connexion recommandée</strong>
                Pour accéder à votre compte, utilisez toujours l'authentification Google. Cela garantit la synchronisation de vos données et une connexion sécurisée.
              </div>
            </div>
            
            <div class="footer">
              <p>UNWARE STUDIO</p>
              <div class="footer-links">
                <a href="https://nexa-neon.vercel.app/Support/contact.html">Support</a>
                <a href="https://nexa-neon.vercel.app/legals/politique-confidentialite.html">Confidentialité</a>
                <a href="https://nexa-neon.vercel.app/legals/conditions-utilisation.html">Conditions</a>
              </div>
              <p style="margin-top: 20px; opacity: 0.7;">
                © 2025 UNWARE STUDIO. Tous droits réservés.<br>
                Cet email a été envoyé à ${user.email}
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      textContent: `
NEXA - CONFIRMATION DE VOTRE COMPTE

Bonjour ${user_metadata?.full_name || 'Utilisateur'},

Votre compte NEXA a été activé avec succès. Vous avez désormais accès à notre plateforme et serez informé du lancement du jeu.

DÉTAILS DU COMPTE
Nom complet: ${user_metadata?.full_name || 'Non spécifié'}
Adresse email: ${user.email}
Identifiant: ${user_metadata?.preferred_username || user.email.split('@')[0]}
Date d'inscription: ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}

À PROPOS DE NEXA
NEXA est actuellement en développement. Vous serez notifié par email lorsque le jeu sera disponible au téléchargement. Votre compte est déjà configuré pour une expérience sans interruption le jour du lancement.

ACCÉDER À VOTRE COMPTE
https://nexa-neon.vercel.app/account/account.html

CONNEXION RECOMMANDÉE
Pour accéder à votre compte, utilisez toujours l'authentification Google. Cela garantit la synchronisation de vos données et une connexion sécurisée.

---
UNWARE STUDIO
© 2025 UNWARE STUDIO. Tous droits réservés.
Support: https://nexa-neon.vercel.app/Support/contact.html

Cet email a été envoyé à ${user.email}
      `
    };

    // 🔥 ENVOI VIA BREVO API
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });

    const result = await brevoResponse.json();

    if (!brevoResponse.ok) {
      throw new Error(`Brevo API: ${result.message || 'Erreur inconnue'}`);
    }

    console.log('✅ Email professionnel envoyé avec succès via Brevo');
    return res.status(200).json({ 
      success: true, 
      messageId: result.messageId,
      message: 'Email de bienvenue envoyé avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur envoi email Brevo:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Erreur lors de l\'envoi de l\'email'
    });
  }
}
