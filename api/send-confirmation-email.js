// /api/send-confirmation-email.js
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
    const { email, firstname, type } = request.body;

    // Validation des données requises
    if (!email || !firstname) {
      return response.status(400).json({ 
        error: 'Email et prénom sont requis' 
      });
    }

    console.log(`📨 Tentative d'envoi d'email ${type} à: ${email}`);

    let emailData;

    if (type === 'confirmation') {
      // Générer un token unique
      const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
      const confirmationLink = `https://nexa-neon.vercel.app/account/confirm-email.html?token=${token}&email=${encodeURIComponent(email)}`;

      emailData = {
        sender: {
          name: 'NEXA - UNWARE STUDIO',
          email: 'vancaemerbekepaul@gmail.com' // VOTRE EMAIL
        },
        to: [
          {
            email: email,
            name: firstname
          }
        ],
        subject: 'Activez votre compte NEXA - Confirmation requise',
        htmlContent: `
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
              .warning {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                color: #856404;
                padding: 15px;
                border-radius: 6px;
                margin: 20px 0;
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
                <p>Félicitations ! Votre compte NEXA a été créé avec succès. Pour <strong>activer votre compte</strong> et accéder à toutes les fonctionnalités, veuillez confirmer votre adresse email :</p>
                
                <div class="button-container">
                  <a href="${confirmationLink}" class="button">
                    🎯 ACTIVER MON COMPTE
                  </a>
                </div>

                <div class="warning">
                  <strong>⚠️ IMPORTANT :</strong> Votre compte ne sera actif qu'après avoir cliqué sur ce bouton.
                </div>

                <div class="steps">
                  <p><strong>📋 Ce qui se passe après confirmation :</strong></p>
                  <div class="step">1. Cliquez sur "ACTIVER MON COMPTE"</div>
                  <div class="step">2. Vous serez redirigé vers la page de confirmation</div>
                  <div class="step">3. Votre compte sera validé automatiquement</div>
                  <div class="step">4. Vous pourrez vous connecter immédiatement</div>
                </div>

                <p><strong>🔗 Lien alternatif :</strong></p>
                <p>Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :</p>
                <div class="link-box">
                  ${confirmationLink}
                </div>

                <p><em>⏰ Ce lien expirera dans 24 heures.</em></p>
              </div>
              <div class="footer">
                <p>&copy; 2025 UNWARE STUDIO. Tous droits réservés.</p>
                <p>NEXA - Expérience de jeu révolutionnaire</p>
                <p>Email envoyé depuis: vancaemerbekepaul@gmail.com</p>
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

    // Envoi de l'email via Brevo API
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify(emailData)
    });

    if (!brevoResponse.ok) {
      const errorText = await brevoResponse.text();
      console.error('❌ Erreur Brevo:', errorText);
      throw new Error(`Erreur Brevo: ${brevoResponse.status} - ${errorText}`);
    }

    const result = await brevoResponse.json();
    console.log('✅ Email de confirmation envoyé avec succès via Brevo:', result);

    return response.status(200).json({
      success: true,
      message: 'Email de confirmation envoyé avec succès',
      messageId: result.messageId,
      to: email,
      confirmationLink: emailData.htmlContent.match(/https:\/\/nexa-neon\.vercel\.app\/account\/confirm-email\.html\?[^"]+/)[0]
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
    
    return response.status(500).json({
      error: 'Erreur lors de l\'envoi de l\'email',
      details: error.message
    });
  }
}
