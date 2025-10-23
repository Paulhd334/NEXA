// /api/send-confirmation-email.js
import { sendEmail } from '@resend/cloud';

export default async function handler(request, response) {
  // Autoriser CORS
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { email, firstname, type, confirmationLink } = request.body;

    // Validation des données requises
    if (!email || !firstname) {
      return response.status(400).json({ 
        error: 'Email et prénom sont requis' 
      });
    }

    console.log(`📨 Tentative d'envoi d'email ${type} à: ${email}`);

    let emailConfig;

    if (type === 'confirmation') {
      if (!confirmationLink) {
        return response.status(400).json({ 
          error: 'Lien de confirmation requis' 
        });
      }

      emailConfig = {
        from: 'NEXA <noreply@unware-studio.com>',
        to: email,
        subject: 'Confirmez votre compte NEXA',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { 
                font-family: 'Inter', Arial, sans-serif; 
                color: #333; 
                margin: 0; 
                padding: 0; 
                background: #f5f5f5;
              }
              .container { 
                max-width: 600px; 
                margin: 0 auto; 
                background: white;
              }
              .header { 
                background: linear-gradient(135deg, #0a0a0a 0%, #111111 100%); 
                color: white; 
                padding: 30px 20px; 
                text-align: center; 
              }
              .header h1 { 
                margin: 0; 
                font-size: 28px;
                font-weight: 700;
              }
              .content { 
                padding: 40px 30px; 
                background: white;
                line-height: 1.6;
              }
              .button { 
                background: linear-gradient(135deg, #0a0a0a 0%, #111111 100%); 
                color: white !important; 
                padding: 16px 32px; 
                text-decoration: none; 
                border-radius: 6px; 
                display: inline-block; 
                margin: 20px 0;
                font-size: 16px;
                font-weight: 600;
                border: none;
                cursor: pointer;
              }
              .footer { 
                padding: 30px; 
                text-align: center; 
                color: #666; 
                font-size: 12px; 
                background: #f9f9f9;
                border-top: 1px solid #eee;
              }
              .button-container { 
                text-align: center; 
                margin: 30px 0; 
              }
              .steps { 
                margin: 25px 0; 
                background: #f9f9f9;
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid #0a0a0a;
              }
              .step { 
                margin: 12px 0; 
                padding-left: 10px;
              }
              .link-box {
                background: #f0f0f0; 
                padding: 15px; 
                border-radius: 6px; 
                word-break: break-all;
                font-size: 14px;
                margin: 20px 0;
                border: 1px solid #ddd;
              }
              .highlight {
                color: #0a0a0a;
                font-weight: 600;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎮 NEXA - UNWARE STUDIO</h1>
              </div>
              <div class="content">
                <h2>Bonjour <span class="highlight">${firstname}</span>,</h2>
                <p>Félicitations ! Votre compte NEXA a été créé avec succès. Pour finaliser votre inscription et accéder à toutes les fonctionnalités, veuillez confirmer votre adresse email :</p>
                
                <div class="button-container">
                  <a href="${confirmationLink}" class="button">
                    🎯 CONFIRMER MON EMAIL
                  </a>
                </div>

                <div class="steps">
                  <p><strong>📋 Procédure de confirmation :</strong></p>
                  <div class="step">1. Cliquez sur le bouton "CONFIRMER MON EMAIL"</div>
                  <div class="step">2. Vous serez redirigé vers la page de confirmation</div>
                  <div class="step">3. Votre email sera confirmé automatiquement</div>
                  <div class="step">4. Vous pourrez ensuite vous connecter à votre compte</div>
                </div>

                <p><strong>🔗 Lien alternatif :</strong></p>
                <p>Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :</p>
                <div class="link-box">
                  ${confirmationLink}
                </div>

                <p><em>⏰ Ce lien expirera dans 24 heures.</em></p>
                
                <p><strong>Besoin d'aide ?</strong><br>
                Répondez simplement à cet email ou contactez notre support.</p>
              </div>
              <div class="footer">
                <p>&copy; 2025 UNWARE STUDIO. Tous droits réservés.</p>
                <p>NEXA - Expérience de jeu révolutionnaire</p>
              </div>
            </div>
          </body>
          </html>
        `
      };
    } else if (type === 'waiting') {
      emailConfig = {
        from: 'NEXA <noreply@unware-studio.com>',
        to: email,
        subject: 'Votre compte NEXA est en cours de traitement',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
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
                <p>Votre demande d'inscription a bien été reçue et est en cours de traitement.</p>
                <p>Vous recevrez sous peu un email de confirmation pour finaliser votre inscription.</p>
                <p><strong>Merci pour votre patience !</strong></p>
              </div>
              <div class="footer">
                <p>&copy; 2025 UNWARE STUDIO. Tous droits réservés.</p>
              </div>
            </div>
          </body>
          </html>
        `
      };
    } else {
      return response.status(400).json({ 
        error: 'Type d\'email non supporté' 
      });
    }

    // Envoi de l'email via Resend
    const data = await sendEmail(emailConfig);

    console.log('✅ Email envoyé avec succès:', data);

    return response.status(200).json({
      success: true,
      message: 'Email envoyé avec succès',
      emailId: data.id,
      to: email
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
    
    return response.status(500).json({
      error: 'Erreur lors de l\'envoi de l\'email',
      details: error.message
    });
  }
}
