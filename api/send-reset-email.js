// /api/send-reset-email.js
export default async function handler(req, res) {
  // Autoriser les requêtes cross-origin si nécessaire
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, reset_link } = req.body;

    console.log('📧 Receiving reset request:', { email, reset_link });

    // Validation
    if (!email || !reset_link) {
      console.error('❌ Missing parameters');
      return res.status(400).json({ 
        error: 'Email and reset_link are required' 
      });
    }

    // Configuration Brevo
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || 'noreply@nexa-game.com';
    const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME || 'NEXA';

    console.log('🔑 Brevo config:', { 
      hasKey: !!BREVO_API_KEY,
      sender: BREVO_SENDER_EMAIL 
    });

    if (!BREVO_API_KEY) {
      console.error('❌ Brevo API key not configured');
      return res.status(500).json({ 
        error: 'Email service not configured',
        details: 'BREVO_API_KEY is missing'
      });
    }

    // Données pour Brevo
    const emailData = {
      sender: {
        email: BREVO_SENDER_EMAIL,
        name: BREVO_SENDER_NAME
      },
      to: [
        {
          email: email,
          name: email.split('@')[0]
        }
      ],
      subject: 'Réinitialisation de votre mot de passe NEXA',
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { 
                    font-family: 'Inter', Arial, sans-serif; 
                    background: #f8f9fa;
                    color: #333;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background: white;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    overflow: hidden;
                }
                .header {
                    background: linear-gradient(135deg, #0a0a0a 0%, #111111 100%);
                    padding: 30px;
                    text-align: center;
                    color: white;
                }
                .logo {
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 32px;
                    color: #ffffff;
                    letter-spacing: 2px;
                    margin-bottom: 10px;
                }
                .content {
                    padding: 30px;
                    color: #333;
                }
                .button {
                    display: inline-block;
                    background: #0a0a0a;
                    color: #ffffff;
                    padding: 14px 28px;
                    text-decoration: none;
                    border-radius: 4px;
                    font-weight: 600;
                    margin: 20px 0;
                }
                .footer {
                    background: #f8f9fa;
                    padding: 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                    border-top: 1px solid #e0e0e0;
                }
                .warning {
                    background: #fff3cd;
                    border: 1px solid #ffeaa7;
                    padding: 15px;
                    border-radius: 4px;
                    margin: 20px 0;
                    font-size: 12px;
                    color: #856404;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">NEXA</div>
                    <p style="margin: 0; opacity: 0.8;">Réinitialisation de mot de passe</p>
                </div>
                <div class="content">
                    <h2 style="margin-bottom: 20px;">Bonjour,</h2>
                    <p style="line-height: 1.6;">
                        Vous avez demandé la réinitialisation de votre mot de passe NEXA.
                        Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :
                    </p>
                    
                    <div style="text-align: center;">
                        <a href="${reset_link}" class="button" style="color: white;">
                            Réinitialiser mon mot de passe
                        </a>
                    </div>

                    <div class="warning">
                        <strong>⚠️ Important :</strong> Ce lien expirera dans 24 heures.
                        Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
                    </div>

                    <p style="color: #666; font-size: 12px; margin-top: 30px;">
                        Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
                        <a href="${reset_link}" style="color: #0a0a0a; word-break: break-all;">${reset_link}</a>
                    </p>
                </div>
                <div class="footer">
                    <p>&copy; 2025 UNWARE STUDIO. Tous droits réservés.</p>
                    <p>Cet email a été envoyé à ${email}</p>
                </div>
            </div>
        </body>
        </html>
      `,
      textContent: `
RÉINITIALISATION DE MOT DE PASSE NEXA

Bonjour,

Vous avez demandé la réinitialisation de votre mot de passe NEXA.

Pour créer un nouveau mot de passe, cliquez sur ce lien :
${reset_link}

⚠️ Important : Ce lien expirera dans 24 heures.
Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.

Si le lien ne fonctionne pas, copiez et collez cette URL dans votre navigateur :
${reset_link}

--
© 2025 UNWARE STUDIO. Tous droits réservés.
Cet email a été envoyé à ${email}
      `
    };

    console.log('📤 Sending to Brevo API...');

    // Envoi via Brevo
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    const result = await response.json();

    console.log('📨 Brevo API response:', {
      status: response.status,
      result: result
    });

    if (!response.ok) {
      console.error('❌ Brevo API error:', result);
      return res.status(500).json({ 
        error: 'Failed to send email',
        details: result.message || 'Unknown error from Brevo'
      });
    }

    console.log('✅ Reset email sent to:', email);
    console.log('📧 Message ID:', result.messageId);

    return res.status(200).json({
      success: true,
      message: 'Reset email sent successfully',
      messageId: result.messageId
    });

  } catch (error) {
    console.error('💥 Error sending reset email:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
}
