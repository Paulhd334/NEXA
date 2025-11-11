// /api/send-welcome-email.js
import Brevo from '@getbrevo/brevo';

export default async function handler(req, res) {
  // 🔥 Vérification méthode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { user, user_metadata } = req.body;

    // 🔥 Validation des données
    if (!user || !user.email) {
      return res.status(400).json({ error: 'Données utilisateur manquantes' });
    }

    // 🔥 Configuration Brevo sécurisée
    const defaultClient = Brevo.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY; // Stocké en variable d'environnement

    const apiInstance = new Brevo.TransactionalEmailsApi();
    
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    
    sendSmtpEmail.subject = `🎮 Bienvenue dans NEXA, ${user_metadata?.full_name || 'Joueur'} !`;
    sendSmtpEmail.sender = {
      name: 'Équipe NEXA - UNWARE STUDIO',
      email: 'contact.unwarestudio@gmail.com'
    };
    sendSmtpEmail.to = [{
      email: user.email,
      name: user_metadata?.full_name || user.email.split('@')[0]
    }];
    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
          .header { background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); color: white; padding: 40px; text-align: center; }
          .content { padding: 40px; color: #333; line-height: 1.6; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
          .btn { background: #000000; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
          .user-info { background: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">🎮 BIENVENUE DANS NEXA</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">L'aventure commence maintenant !</p>
          </div>
          <div class="content">
            <h2 style="color: #000; margin-bottom: 20px;">Bonjour ${user_metadata?.full_name || 'Joueur'} !</h2>
            <p>Félicitations pour la création de votre compte NEXA. Vous faites maintenant partie de notre communauté de joueurs passionnés.</p>
            
            <div class="user-info">
              <h3 style="margin-top: 0; color: #000;">📋 Votre compte</h3>
              <p><strong>Email :</strong> ${user.email}</p>
              <p><strong>Nom d'utilisateur :</strong> ${user_metadata?.preferred_username || user.email.split('@')[0]}</p>
              <p><strong>Date d'inscription :</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
            </div>

            <h3 style="color: #000;">🚀 Que faire maintenant ?</h3>
            <p>Explorez l'univers NEXA, rejoignez d'autres joueurs et commencez votre aventure !</p>
            
            <a href="${process.env.NEXA_URL}/account/account.html" class="btn" style="color: white; text-decoration: none;">ACCÉDER À MON COMPTE</a>
            
            <p><strong>💡 Astuce :</strong> Téléchargez le jeu et connectez-vous avec votre compte Google pour synchroniser votre progression.</p>
            
            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <strong>Besoin d'aide ?</strong><br>
              Consultez notre <a href="${process.env.NEXA_URL}/Support/centre-aide.html" style="color: #000;">centre d'aide</a> ou 
              <a href="${process.env.NEXA_URL}/Support/contact.html" style="color: #000;">contactez-nous</a>.
            </p>
          </div>
          <div class="footer">
            <p style="margin: 0;">© 2025 UNWARE STUDIO - NEXA. Tous droits réservés.</p>
            <p style="margin: 5px 0 0 0;">
              <a href="${process.env.NEXA_URL}/legals/politique-confidentialite.html" style="color: #666; text-decoration: none;">Politique de confidentialité</a> • 
              <a href="${process.env.NEXA_URL}/Support/contact.html" style="color: #666; text-decoration: none;">Support</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    sendSmtpEmail.textContent = `
BIENVENUE DANS NEXA

Bonjour ${user_metadata?.full_name || 'Joueur'} !

Félicitations pour la création de votre compte NEXA. Vous faites maintenant partie de notre communauté de joueurs passionnés.

VOTRE COMPTE :
📧 Email : ${user.email}
👤 Nom d'utilisateur : ${user_metadata?.preferred_username || user.email.split('@')[0]}
📅 Date d'inscription : ${new Date().toLocaleDateString('fr-FR')}

🚀 QUE FAIRE MAINTENANT ?
Explorez l'univers NEXA, rejoignez d'autres joueurs et commencez votre aventure !

Accédez à votre compte : ${process.env.NEXA_URL}/account/account.html

💡 Astuce : Téléchargez le jeu et connectez-vous avec votre compte Google pour synchroniser votre progression.

---
© 2025 UNWARE STUDIO - NEXA
${process.env.NEXA_URL}/Support/contact.html
    `;

    // 🔥 Envoi de l'email via Brevo
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log('✅ Email envoyé via Brevo:', data);
    res.status(200).json({ 
      success: true, 
      messageId: data.messageId,
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
