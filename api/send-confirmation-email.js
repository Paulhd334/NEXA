// /api/send-confirmation-email.js
export default async function handler(req, res) {
  // 🔥 AJOUTE CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, firstname, confirmationLink, type, token } = req.body;

TE
    const BREVO_API_KEY = process.env.BREVO_API_KEY;

    
if (!BREVO_API_KEY) {
      console.error('❌ BREVO_API_KEY manquante');
      return res.status(500).json({ message: 'Configuration email manquante' });
    }

    console.log('📧 Tentative envoi email à:', email);

    let emailData = {};

    if (type === 'confirmation') {
      emailData = {
        sender: {
          name: 'NEXA - UNWARE STUDIO',
          email: 'contact.unwarestudio@gmail.com'
        },
        to: [{ email, name: firstname }],
        subject: 'Confirmez votre compte NEXA',
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #0a0a0a; color: white; padding: 20px; text-align: center; }
              .content { padding: 30px; background: #f9f9f9; }
              .button { background: #0a0a0a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; }
              .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>NEXA - UNWARE STUDIO</h1>
              </div>
              <div class="content">
                <h2>Bonjour ${firstname},</h2>
                <p>Merci de vous être inscrit à NEXA ! Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :</p>
                <p style="text-align: center;">
                  <a href="${confirmationLink}" class="button">Confirmer mon compte</a>
                </p>
                <p>Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :</p>
                <p><code>${confirmationLink}</code></p>
                <p>Ce lien expirera dans 24 heures.</p>
              </div>
              <div class="footer">
                <p>&copy; 2025 UNWARE STUDIO. Tous droits réservés.</p>
              </div>
            </div>
          </body>
          </html>
        `
      };
    } else if (type === 'waiting') {
      emailData = {
        sender: {
          name: 'NEXA - UNWARE STUDIO',
          email: 'contact.unwarestudio@gmail.com'
        },
        to: [{ email, name: firstname }],
        subject: 'Votre inscription NEXA est en attente',
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #0a0a0a; color: white; padding: 20px; text-align: center; }
              .content { padding: 30px; background: #f9f9f9; }
              .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>NEXA - UNWARE STUDIO</h1>
              </div>
              <div class="content">
                <h2>Bonjour ${firstname},</h2>
                <p>Votre inscription a été reçue ! En raison d'une forte demande, votre compte sera activé dans les prochaines heures.</p>
                <p><strong>Token de référence :</strong> ${token}</p>
                <p>Nous vous enverrons un email de confirmation dès que votre compte sera prêt.</p>
                <p>Merci pour votre patience !</p>
              </div>
              <div class="footer">
                <p>&copy; 2025 UNWARE STUDIO. Tous droits réservés.</p>
              </div>
            </div>
          </body>
          </html>
        `
      };
    }

    console.log('🔗 Appel Brevo...');
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify(emailData)
    });

    const brevoData = await brevoResponse.json();
    console.log('📨 Réponse Brevo:', brevoResponse.status, brevoData);

    if (!brevoResponse.ok) {
      throw new Error(brevoData.message || `Erreur Brevo: ${brevoResponse.status}`);
    }

    console.log('✅ Email envoyé avec succès');
    res.status(200).json({ success: true, message: 'Email envoyé', brevoId: brevoData.messageId });

  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    res.status(500).json({ message: error.message });
  }
}
