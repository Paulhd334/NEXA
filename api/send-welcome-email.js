// /api/send-welcome-email.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { user, user_metadata } = req.body;

    if (!user || !user.email) {
      return res.status(400).json({ error: 'Données utilisateur manquantes' });
    }

    // 🔥 TON API KEY BREVO ICI
    const BREVO_API_KEY = 'xkeysib-ta-cle-api-brevo-ici';
    
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
            body { font-family: 'Inter', Arial, sans-serif; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e0e0e0; }
            .header { background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); color: white; padding: 40px; text-align: center; }
            .content { padding: 40px; color: #333; line-height: 1.6; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
            .btn { background: #000000; color: white; padding: 14px 35px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; font-weight: 600; }
            .user-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 32px;">🎮 BIENVENUE DANS NEXA</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">L'aventure commence maintenant !</p>
            </div>
            <div class="content">
              <h2 style="color: #000; margin-bottom: 20px;">Bonjour ${user_metadata?.full_name || 'Joueur'} !</h2>
              <p><strong>Félicitations !</strong> Votre compte NEXA a été créé avec succès.</p>
              
              <div class="user-info">
                <h3 style="margin-top: 0; color: #000; border-bottom: 2px solid #000; padding-bottom: 10px;">📋 VOTRE COMPTE</h3>
                <p><strong>👤 Nom :</strong> ${user_metadata?.full_name || 'Non spécifié'}</p>
                <p><strong>📧 Email :</strong> ${user.email}</p>
                <p><strong>🎯 Nom d'utilisateur :</strong> ${user_metadata?.preferred_username || user.email.split('@')[0]}</p>
                <p><strong>📅 Date d'inscription :</strong> ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>

              <h3 style="color: #000;">🚀 COMMENCEZ VOTRE AVENTURE</h3>
              <p>Votre compte est maintenant actif et vous pouvez :</p>
              <ul>
                <li>📥 Télécharger le jeu NEXA</li>
                <li>🎯 Accéder à votre profil personnel</li>
                <li>👥 Rejoindre la communauté</li>
                <li>💾 Sauvegarder votre progression</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://nexa-neon.vercel.app/account/account.html" class="btn" style="color: white; text-decoration: none; background: #000; padding: 14px 35px; border-radius: 8px; font-weight: 600;">
                  ACCÉDER À MON COMPTE
                </a>
              </div>
              
              <div style="background: #fff3cd; padding: 15px; border-radius: 6px; border-left: 4px solid #ffc107; margin: 20px 0;">
                <strong>💡 Conseil du jour :</strong> Connectez-vous toujours avec Google pour synchroniser automatiquement votre progression entre tous vos appareils.
              </div>
              
              <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <strong>❓ Besoin d'aide ?</strong><br>
                Notre équipe de support est là pour vous aider :<br>
                📞 <a href="https://nexa-neon.vercel.app/Support/contact.html" style="color: #000; font-weight: 600;">Centre d'aide & Contact</a>
              </p>
            </div>
            <div class="footer">
              <p style="margin: 0;">© 2025 UNWARE STUDIO - NEXA. Tous droits réservés.</p>
              <p style="margin: 10px 0 0 0;">
                <a href="https://nexa-neon.vercel.app/legals/politique-confidentialite.html" style="color: #666; text-decoration: none; margin: 0 10px;">Confidentialité</a> • 
                <a href="https://nexa-neon.vercel.app/Support/contact.html" style="color: #666; text-decoration: none; margin: 0 10px;">Support</a> • 
                <a href="https://nexa-neon.vercel.app/legals/conditions-utilisation.html" style="color: #666; text-decoration: none; margin: 0 10px;">Conditions</a>
              </p>
              <p style="margin: 5px 0 0 0; font-size: 11px; color: #999;">
                Cet email a été envoyé à ${user.email} suite à la création de votre compte NEXA.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      textContent: `
BIENVENUE DANS NEXA - VOTRE COMPTE EST MAINTENANT ACTIF !

Bonjour ${user_metadata?.full_name || 'Joueur'} !

Félicitations ! Votre compte NEXA a été créé avec succès.

📋 VOTRE COMPTE
👤 Nom : ${user_metadata?.full_name || 'Non spécifié'}
📧 Email : ${user.email}  
🎯 Nom d'utilisateur : ${user_metadata?.preferred_username || user.email.split('@')[0]}
📅 Date d'inscription : ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

🚀 COMMENCEZ VOTRE AVENTURE
• Téléchargez le jeu NEXA
• Accédez à votre profil personnel  
• Rejoignez la communauté
• Sauvegardez votre progression

🎯 ACCÉDEZ À VOTRE COMPTE :
https://nexa-neon.vercel.app/account/account.html

💡 CONSEIL : Connectez-vous toujours avec Google pour synchroniser automatiquement votre progression.

---
❓ BESOIN D'AIDE ?
Notre équipe de support est là pour vous aider :
https://nexa-neon.vercel.app/Support/contact.html

---
© 2025 UNWARE STUDIO - NEXA
https://nexa-neon.vercel.app

Cet email a été envoyé à ${user.email} suite à la création de votre compte NEXA.
      `
    };

    // 🔥 ENVOI VIA BREVO API
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`Brevo API: ${result.message || 'Erreur inconnue'}`);
    }

    console.log('✅ Email envoyé avec succès via Brevo');
    res.status(200).json({ 
      success: true, 
      messageId: result.messageId,
      message: 'Email de bienvenue envoyé avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur envoi email Brevo:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erreur lors de l\'envoi de l\'email'
    });
  }
}
