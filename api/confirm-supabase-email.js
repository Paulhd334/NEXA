// api/confirm-supabase-email.js
const express = require('express');
const router = express.Router();
const SibApiV3Sdk = require('sib-api-v3-sdk');
const { createClient } = require('@supabase/supabase-js');

// Configuration Brevo
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Configuration Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Utilisez la clé service_role (pas anon)
);

// Middleware pour parser le JSON
router.use(express.json());

// Endpoint pour envoyer l'email de bienvenue
router.post('/send-welcome', async (req, res) => {
  try {
    const { email, user_id, username = 'Joueur' } = req.body;

    // Validation des données
    if (!email || !user_id) {
      return res.status(400).json({
        success: false,
        error: 'Email et user_id sont requis'
      });
    }

    console.log(`📧 Envoi email de bienvenue à: ${email}`);

    // Créer l'email avec Brevo
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    
    sendSmtpEmail.subject = "🎮 Bienvenue dans l'aventure NEXA !";
    sendSmtpEmail.htmlContent = createWelcomeEmailHTML(username);
    sendSmtpEmail.sender = { 
      name: "NEXA - UNWARE STUDIO", 
      email: "noreply@unware-studio.com" 
    };
    sendSmtpEmail.to = [{ email, name: username }];
    sendSmtpEmail.replyTo = { 
      email: "support@unware-studio.com", 
      name: "Support NEXA" 
    };

    // Envoyer l'email via Brevo
    const emailResult = await apiInstance.sendTransacEmail(sendSmtpEmail);
    
    console.log('✅ Email envoyé avec succès:', emailResult.messageId);

    // Mettre à jour le profil utilisateur dans Supabase
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        welcome_email_sent: true,
        welcome_email_sent_at: new Date().toISOString()
      })
      .eq('id', user_id);

    if (updateError) {
      console.warn('⚠️ Profil non mis à jour:', updateError.message);
    }

    res.json({
      success: true,
      message: 'Email de bienvenue envoyé avec succès',
      messageId: emailResult.messageId
    });

  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'envoi de l\'email',
      details: error.message
    });
  }
});

// Endpoint pour envoyer un email de confirmation
router.post('/send-confirmation', async (req, res) => {
  try {
    const { email, confirmation_url } = req.body;

    if (!email || !confirmation_url) {
      return res.status(400).json({
        success: false,
        error: 'Email et confirmation_url sont requis'
      });
    }

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    
    sendSmtpEmail.subject = "🔐 Confirmez votre email NEXA";
    sendSmtpEmail.htmlContent = createConfirmationEmailHTML(confirmation_url);
    sendSmtpEmail.sender = { 
      name: "NEXA - UNWARE STUDIO", 
      email: "noreply@unware-studio.com" 
    };
    sendSmtpEmail.to = [{ email }];

    const emailResult = await apiInstance.sendTransacEmail(sendSmtpEmail);
    
    console.log('✅ Email de confirmation envoyé:', emailResult.messageId);

    res.json({
      success: true,
      message: 'Email de confirmation envoyé',
      messageId: emailResult.messageId
    });

  } catch (error) {
    console.error('❌ Erreur envoi email confirmation:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'envoi de l\'email de confirmation'
    });
  }
});

// Fonction pour créer le HTML de l'email de bienvenue
function createWelcomeEmailHTML(username) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { 
      font-family: 'Inter', Arial, sans-serif; 
      background: #0a0a0a; 
      color: #ffffff; 
      margin: 0; 
      padding: 0; 
      line-height: 1.6;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background: #1a1a1a; 
      border-radius: 12px; 
      overflow: hidden;
      border: 1px solid #333;
    }
    .header { 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 30px; 
      text-align: center; 
    }
    .logo { 
      font-family: 'Bebas Neue', sans-serif; 
      font-size: 42px; 
      color: #ffffff; 
      margin-bottom: 10px;
      letter-spacing: 3px;
    }
    .content { 
      padding: 40px 30px; 
    }
    .welcome-text {
      font-size: 24px;
      color: #667eea;
      margin-bottom: 20px;
      font-weight: 600;
    }
    .features { 
      margin: 30px 0; 
    }
    .feature { 
      display: flex; 
      align-items: center; 
      margin-bottom: 15px; 
      padding: 15px;
      background: rgba(255,255,255,0.05);
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }
    .feature-icon { 
      color: #667eea; 
      margin-right: 15px; 
      font-size: 20px;
    }
    .cta-button { 
      display: inline-block; 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white; 
      padding: 15px 30px; 
      text-decoration: none; 
      border-radius: 8px; 
      font-weight: 600; 
      margin: 20px 0; 
      text-align: center;
    }
    .footer { 
      text-align: center; 
      padding: 30px; 
      background: #0f0f0f; 
      color: #888; 
      font-size: 12px; 
    }
    .social-links { 
      margin: 20px 0; 
    }
    .social-link { 
      display: inline-block; 
      margin: 0 10px; 
      color: #667eea; 
      text-decoration: none; 
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">NEXA</div>
      <div style="color: rgba(255,255,255,0.8); font-size: 16px;">UNWARE STUDIO</div>
    </div>
    
    <div class="content">
      <div class="welcome-text">Bienvenue, ${username} !</div>
      
      <p>Votre compte NEXA a été créé avec succès. Préparez-vous à vivre une expérience de jeu révolutionnaire développée avec Unreal Engine 5.</p>
      
      <div class="features">
        <div class="feature">
          <span class="feature-icon">🎮</span>
          <span>Accès anticipé aux nouvelles fonctionnalités</span>
        </div>
        <div class="feature">
          <span class="feature-icon">💾</span>
          <span>Progression sauvegardée sur le cloud</span>
        </div>
        <div class="feature">
          <span class="feature-icon">🎁</span>
          <span>Contenu exclusif et récompenses spéciales</span>
        </div>
        <div class="feature">
          <span class="feature-icon">👥</span>
          <span>Communauté de joueurs passionnés</span>
        </div>
      </div>
      
      <div style="text-align: center;">
        <a href="https://votre-domaine.com/account" class="cta-button">Accéder à mon compte</a>
      </div>
      
      <p><strong>Prochaines étapes :</strong></p>
      <ul>
        <li>Téléchargez le launcher NEXA</li>
        <li>Explorez les galeries et fonctionnalités</li>
        <li>Rejoignez notre communauté Discord</li>
      </ul>
    </div>
    
    <div class="footer">
      <div class="social-links">
        <a href="#" class="social-link">Twitter</a>
        <a href="#" class="social-link">Discord</a>
        <a href="#" class="social-link">YouTube</a>
        <a href="#" class="social-link">Instagram</a>
      </div>
      <p>&copy; 2025 UNWARE STUDIO. Tous droits réservés.</p>
      <p style="font-size: 11px; margin-top: 10px;">
        <a href="https://votre-domaine.com/legals/politique-confidentialite" style="color: #667eea;">Politique de confidentialité</a> | 
        <a href="https://votre-domaine.com/support" style="color: #667eea;">Support</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

// Fonction pour créer le HTML de l'email de confirmation
function createConfirmationEmailHTML(confirmationUrl) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; }
    .header { background: #667eea; padding: 30px; text-align: center; color: white; }
    .content { padding: 30px; }
    .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; }
    .footer { text-align: center; padding: 20px; background: #f0f0f0; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Confirmez votre email</h1>
    </div>
    <div class="content">
      <p>Cliquez sur le bouton ci-dessous pour confirmer votre adresse email :</p>
      <a href="${confirmationUrl}" class="cta-button">Confirmer mon email</a>
      <p>Si le bouton ne fonctionne pas, copiez ce lien :</p>
      <p style="word-break: break-all; color: #666;">${confirmationUrl}</p>
    </div>
    <div class="footer">
      <p>&copy; 2025 UNWARE STUDIO</p>
    </div>
  </div>
</body>
</html>
  `;
}

module.exports = router;
