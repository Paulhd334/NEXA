// /api/send-confirmation-email.js - VERSION PROFESSIONNELLE
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
    const { email, firstname, type, confirmationLink, rawToken } = request.body;

    // Validation des données requises
    if (!email || !firstname || !confirmationLink) {
      return response.status(400).json({ 
        error: 'Email, prénom et lien de confirmation sont requis' 
      });
    }

    console.log(`📨 Envoi email ${type} à: ${email}`);
    console.log('🔗 Lien confirmation:', confirmationLink);

    let emailData;

    if (type === 'confirmation') {
      emailData = {
        sender: {
          name: 'NEXA - UNWARE STUDIO',
          email: 'vancaemerbekepaul@gmail.com'
        },
        to: [
          {
            email: email,
            name: firstname
          }
        ],
        subject: 'Activez votre compte NEXA',
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body { 
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
                color: #1a1a1a; 
                line-height: 1.6;
                background: #f8fafc;
                padding: 20px;
              }
              .container { 
                max-width: 500px; 
                margin: 0 auto; 
                background: white;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
              }
              .header { 
                background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%); 
                color: white; 
                padding: 40px 30px; 
                text-align: center;
                position: relative;
              }
              .header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
              }
              .logo {
                font-size: 28px;
                font-weight: 800;
                letter-spacing: 1px;
                margin-bottom: 8px;
              }
              .tagline {
                font-size: 14px;
                opacity: 0.8;
                font-weight: 400;
              }
              .content { 
                padding: 40px 30px; 
                text-align: center;
              }
              .greeting {
                font-size: 20px;
                font-weight: 600;
                margin-bottom: 16px;
                color: #1a1a1a;
              }
              .message {
                color: #64748b;
                font-size: 15px;
                margin-bottom: 32px;
                line-height: 1.6;
              }
              .button { 
                background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%); 
                color: white !important; 
                padding: 16px 40px; 
                text-decoration: none; 
                border-radius: 12px; 
                display: inline-block; 
                font-size: 16px;
                font-weight: 600;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(10, 10, 10, 0.2);
                margin: 20px 0;
              }
              .button:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(10, 10, 10, 0.3);
              }
              .divider {
                height: 1px;
                background: #e2e8f0;
                margin: 32px 0;
              }
              .info-box {
                background: #f8fafc;
                border-radius: 12px;
                padding: 20px;
                margin: 24px 0;
                border-left: 4px solid #0a0a0a;
              }
              .info-title {
                font-weight: 600;
                color: #0a0a0a;
                margin-bottom: 8px;
                font-size: 14px;
              }
              .info-text {
                color: #64748b;
                font-size: 13px;
                line-height: 1.5;
              }
              .link-box {
                background: #f1f5f9;
                padding: 16px;
                border-radius: 8px;
                word-break: break-all;
                font-size: 13px;
                color: #475569;
                border: 1px solid #e2e8f0;
                margin: 20px 0;
                text-align: left;
              }
              .footer { 
                padding: 30px; 
                text-align: center; 
                color: #94a3b8; 
                font-size: 12px; 
                background: #f8fafc;
                border-top: 1px solid #e2e8f0;
              }
              .social-links {
                display: flex;
                justify-content: center;
                gap: 16px;
                margin: 20px 0;
              }
              .social-link {
                color: #64748b;
                text-decoration: none;
                font-size: 13px;
                transition: color 0.3s ease;
              }
              .social-link:hover {
                color: #0a0a0a;
              }
              .expiry {
                background: #fff7ed;
                color: #c2410c;
                padding: 12px;
                border-radius: 8px;
                font-size: 13px;
                margin: 20px 0;
                border: 1px solid #fed7aa;
              }
              @media (max-width: 600px) {
                body { padding: 10px; }
                .container { border-radius: 12px; }
                .content { padding: 30px 20px; }
                .header { padding: 30px 20px; }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">NEXA</div>
                <div class="tagline">UNWARE STUDIO</div>
              </div>
              
              <div class="content">
                <div class="greeting">Bonjour ${firstname}</div>
                
                <p class="message">
                  Votre compte NEXA a été créé avec succès. 
                  Confirmez votre email pour activer votre compte et commencer l'aventure.
                </p>

                <a href="${confirmationLink}" class="button">
                  Activer mon compte
                </a>

                <div class="expiry">
                  ⏰ Ce lien expire dans 24 heures
                </div>

                <div class="divider"></div>

                <div class="info-box">
                  <div class="info-title">Problème avec le bouton ?</div>
                  <div class="info-text">Copiez-collez ce lien dans votre navigateur :</div>
                  <div class="link-box">${confirmationLink}</div>
                </div>
              </div>
              
              <div class="footer">
                <div class="social-links">
                  <a href="#" class="social-link">Twitter</a>
                  <a href="#" class="social-link">Discord</a>
                  <a href="#" class="social-link">Support</a>
                </div>
                <p>&copy; 2025 UNWARE STUDIO. Tous droits réservés.</p>
                <p>NEXA - Expérience de jeu nouvelle génération</p>
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
    console.log('✅ Email envoyé avec succès:', result.messageId);

    return response.status(200).json({
      success: true,
      message: 'Email de confirmation envoyé',
      messageId: result.messageId,
      to: email
    });

  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    
    return response.status(500).json({
      error: 'Erreur lors de l\'envoi de l\'email',
      details: error.message
    });
  }
}
