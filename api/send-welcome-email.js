// /api/send-welcome-email.js
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

    // 🔥 API KEY SÉCURISÉE DANS LES VARIABLES D'ENVIRONNEMENT
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    
    if (!BREVO_API_KEY) {
      return res.status(500).json({ error: 'Service email non configuré' });
    }
    
    const emailData = {
      sender: {
        name: 'Équipe NEXA - UNWARE STUDIO',
        email: 'contact.unwarestudio@gmail.com'
      },
      to: [{
        email: user.email,
        name: user_metadata?.full_name || user.email.split('@')[0]
      }],
      subject: `🎮 Bienvenue dans NEXA, ${user_metadata?.full_name || 'Joueur'} !`,
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Inter', Arial, sans-serif; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
            .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); color: white; padding: 40px; text-align: center; }
            .content { padding: 40px; color: #333; line-height: 1.6; }
            .footer { background: #f8f9fa; padding: 25px; text-align: center; color: #666; font-size: 13px; border-top: 1px solid #e9ecef; }
            .btn { background: #000000; color: white; padding: 14px 35px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; font-weight: 600; font-size: 16px; }
            .user-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #000; }
            .tip-box { background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 32px; font-weight: 700;">🎮 BIENVENUE DANS NEXA</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">Votre aventure commence maintenant !</p>
            </div>
            <div class="content">
              <h2 style="color: #000; margin-bottom: 10px; font-weight: 600;">Bonjour ${user_metadata?.full_name || 'Joueur'} !</h2>
              <p style="font-size: 16px; color: #666;">Félicitations pour la création de votre compte NEXA. Vous faites maintenant partie de notre communauté de joueurs passionnés.</p>
              
              <div class="user-info">
                <h3 style="margin-top: 0; color: #000; border-bottom: 2px solid #000; padding-bottom: 10px; font-weight: 600;">📋 VOTRE COMPTE</h3>
                <p><strong>👤 Nom :</strong> ${user_metadata?.full_name || 'Non spécifié'}</p>
                <p><strong>📧 Email :</strong> ${user.email}</p>
                <p><strong>🎯 Nom d'utilisateur :</strong> ${user_metadata?.preferred_username || user.email.split('@')[0]}</p>
                <p><strong>📅 Date d'inscription :</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
              </div>

              <h3 style="color: #000; font-weight: 600;">🚀 COMMENCEZ DÈS MAINTENANT</h3>
              <p>Votre compte est entièrement configuré et prêt à l'emploi :</p>
              <ul style="padding-left: 20px;">
                <li>🎮 Téléchargez et jouez à NEXA</li>
                <li>👤 Personnalisez votre profil</li>
                <li>🏆 Débloquez des succès</li>
                <li>💾 Sauvegardez votre progression cloud</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://nexa-neon.vercel.app/account/account.html" class="btn" style="color: white; text-decoration: none;">
                  🎯 ACCÉDER À MON COMPTE
                </a>
              </div>
              
              <div class="tip-box">
                <strong>💡 Conseil expert :</strong> Utilisez toujours la connexion Google pour synchroniser automatiquement votre progression sur tous vos appareils.
              </div>
              
              <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666;">
                <strong>❓ Une question ?</strong><br>
                Notre équipe est là pour vous aider :<br>
                <a href="https://nexa-neon.vercel.app/Support/contact.html" style="color: #000; font-weight: 600; text-decoration: none;">📞 Centre d'aide & Support</a>
              </p>
            </div>
            <div class="footer">
              <p style="margin: 0 0 10px 0; font-weight: 600;">UNWARE STUDIO</p>
              <p style="margin: 0; font-size: 12px; color: #999;">
                © 2025 UNWARE STUDIO - NEXA. Tous droits réservés.<br>
                <a href="https://nexa-neon.vercel.app/legals/politique-confidentialite.html" style="color: #666; text-decoration: none;">Confidentialité</a> • 
                <a href="https://nexa-neon.vercel.app/Support/contact.html" style="color: #666; text-decoration: none;">Support</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      textContent: `
BIENVENUE DANS NEXA - CONFIRMATION DE VOTRE INSCRIPTION

Bonjour ${user_metadata?.full_name || 'Joueur'} !

Félicitations ! Votre compte NEXA a été créé avec succès le ${new Date().toLocaleDateString('fr-FR')}.

📋 VOTRE COMPTE
👤 Nom : ${user_metadata?.full_name || 'Non spécifié'}
📧 Email : ${user.email}
🎯 Nom d'utilisateur : ${user_metadata?.preferred_username || user.email.split('@')[0]}
📅 Date d'inscription : ${new Date().toLocaleDateString('fr-FR')}

🚀 COMMENCEZ VOTRE AVENTURE
• Téléchargez NEXA
• Personnalisez votre profil
• Débloquez des succès
• Sauvegardez votre progression

🎯 ACCÉDEZ À VOTRE COMPTE :
https://nexa-neon.vercel.app/account/account.html

💡 CONSEIL : Utilisez la connexion Google pour synchroniser automatiquement votre progression.

---
❓ BESOIN D'AIDE ?
https://nexa-neon.vercel.app/Support/contact.html

---
© 2025 UNWARE STUDIO - NEXA
https://nexa-neon.vercel.app
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

    console.log('✅ Email envoyé avec succès via Brevo');
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
