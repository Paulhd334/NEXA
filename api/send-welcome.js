// api/send-welcome.js
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
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = async (req, res) => {
  // Autoriser CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Gérer les requêtes OPTIONS pour CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Seulement autoriser les requêtes POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, user_id, username = 'Joueur', is_new_user = true } = req.body;

    // Validation des données
    if (!email || !user_id) {
      return res.status(400).json({
        success: false,
        error: 'Email et user_id sont requis'
      });
    }

    console.log(`📧 Envoi email de ${is_new_user ? 'BIENVENUE' : 'RETOUR'} à: ${email}`);

    // Créer l'email adapté au type d'utilisateur
    const emailContent = is_new_user ? 
      createWelcomeEmailHTML(username) : 
      createWelcomeBackEmailHTML(username);

    const emailSubject = is_new_user ?
      "🎮 Bienvenue dans l'aventure NEXA !" :
      "👋 Content de vous revoir sur NEXA !";

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    
    sendSmtpEmail.subject = emailSubject;
    sendSmtpEmail.htmlContent = emailContent;
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
    
    console.log(`✅ Email ${is_new_user ? 'bienvenue' : 'retour'} envoyé:`, emailResult.messageId);

    res.json({
      success: true,
      message: `Email ${is_new_user ? 'de bienvenue' : 'de retour'} envoyé avec succès`,
      messageId: emailResult.messageId,
      is_new_user: is_new_user
    });

  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'envoi de l\'email',
      details: error.message
    });
  }
};

// Gardez les fonctions createWelcomeEmailHTML et createWelcomeBackEmailHTML ici...
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
    .highlight {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      margin: 25px 0;
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
      <div class="welcome-text">Bienvenue dans l'aventure NEXA, ${username} ! 🎉</div>
      
      <p>Félicitations ! Votre compte a été créé avec succès et vous faites maintenant partie de notre communauté de joueurs passionnés.</p>
      
      <div class="highlight">
        <strong>Votre aventure commence maintenant !</strong><br>
        Préparez-vous à vivre une expérience de jeu révolutionnaire développée avec Unreal Engine 5.
      </div>
      
      <div class="features">
        <div class="feature">
          <span class="feature-icon">🚀</span>
          <span><strong>Accès anticipé</strong> aux nouvelles fonctionnalités</span>
        </div>
        <div class="feature">
          <span class="feature-icon">💾</span>
          <span><strong>Progression sauvegardée</strong> sur le cloud</span>
        </div>
        <div class="feature">
          <span class="feature-icon">🎁</span>
          <span><strong>Contenu exclusif</strong> et récompenses spéciales</span>
        </div>
        <div class="feature">
          <span class="feature-icon">👥</span>
          <span><strong>Communauté active</strong> de joueurs passionnés</span>
        </div>
      </div>
      
      <div style="text-align: center;">
        <a href="https://nexa-neon.vercel.app/account/account.html" class="cta-button">Commencer l'aventure</a>
      </div>
      
      <p><strong>Prochaines étapes recommandées :</strong></p>
      <ul>
        <li>📥 Téléchargez le launcher NEXA</li>
        <li>🎮 Explorez les galeries et fonctionnalités</li>
        <li>💬 Rejoignez notre communauté Discord</li>
        <li>⚙️ Personnalisez votre profil</li>
      </ul>
    </div>
    
    <div class="footer">
      <div class="social-links">
        <a href="https://twitter.com/nexa" class="social-link">Twitter</a>
        <a href="https://discord.gg/nexa" class="social-link">Discord</a>
        <a href="https://youtube.com/nexa" class="social-link">YouTube</a>
        <a href="https://instagram.com/nexa" class="social-link">Instagram</a>
      </div>
      <p>&copy; 2025 UNWARE STUDIO. Tous droits réservés.</p>
      <p style="font-size: 11px; margin-top: 10px;">
        <a href="https://nexa-neon.vercel.app/legals/politique-confidentialite" style="color: #667eea;">Politique de confidentialité</a> | 
        <a href="https://nexa-neon.vercel.app/support" style="color: #667eea;">Support</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

function createWelcomeBackEmailHTML(username) {
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
      background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
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
      color: #4CAF50;
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
      border-left: 4px solid #4CAF50;
    }
    .feature-icon { 
      color: #4CAF50; 
      margin-right: 15px; 
      font-size: 20px;
    }
    .cta-button { 
      display: inline-block; 
      background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
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
      color: #4CAF50; 
      text-decoration: none; 
    }
    .update-section {
      background: rgba(76, 175, 80, 0.1);
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #4CAF50;
      margin: 25px 0;
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
      <div class="welcome-text">Content de vous revoir, ${username} ! 👋</div>
      
      <p>Nous sommes ravis de vous retrouver dans l'univers NEXA. Votre progression et vos personnalisations ont été sauvegardées.</p>
      
      <div class="update-section">
        <strong>🆕 Nouveautés depuis votre dernière visite :</strong><br>
        • Nouveaux modes de jeu disponibles<br>
        • Événements communautaires en cours<br>
        • Mises à jour graphiques et performances<br>
        • Contenu exclusif ajouté
      </div>
      
      <div class="features">
        <div class="feature">
          <span class="feature-icon">⚡</span>
          <span><strong>Reprenez là où vous vous étiez arrêté</strong></span>
        </div>
        <div class="feature">
          <span class="feature-icon">🎯</span>
          <span><strong>Nouveaux défis</strong> vous attendent</span>
        </div>
        <div class="feature">
          <span class="feature-icon">👥</span>
          <span>Votre <strong>communauté</strong> vous attend</span>
        </div>
        <div class="feature">
          <span class="feature-icon">🆓</span>
          <span><strong>Contenu gratuit</strong> ajouté régulièrement</span>
        </div>
      </div>
      
      <div style="text-align: center;">
        <a href="https://nexa-neon.vercel.app/account/account.html" class="cta-button">Reprendre l'aventure</a>
      </div>
    </div>
    
    <div class="footer">
      <div class="social-links">
        <a href="https://twitter.com/nexa" class="social-link">Twitter</a>
        <a href="https://discord.gg/nexa" class="social-link">Discord</a>
        <a href="https://youtube.com/nexa" class="social-link">YouTube</a>
        <a href="https://instagram.com/nexa" class="social-link">Instagram</a>
      </div>
      <p>&copy; 2025 UNWARE STUDIO. Tous droits réservés.</p>
      <p style="font-size: 11px; margin-top: 10px;">
        <a href="https://nexa-neon.vercel.app/legals/politique-confidentialite" style="color: #4CAF50;">Politique de confidentialité</a> | 
        <a href="https://nexa-neon.vercel.app/support" style="color: #4CAF50;">Support</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}
