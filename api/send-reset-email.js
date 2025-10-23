// /api/send-reset-email.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, reset_link } = req.body;

    // Validation
    if (!email || !reset_link) {
      return res.status(400).json({ 
        error: 'Email and reset_link are required' 
      });
    }

    // Configuration Brevo
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;
    const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME || 'NEXA';

    if (!BREVO_API_KEY) {
      console.error('Brevo API key not configured');
      return res.status(500).json({ error: 'Email service not configured' });
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
          name: email.split('@')[0] // Utilise le nom avant @ comme nom
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
                    background: #0a0a0a;
                    color: #e0e0e0;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background: #111111;
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 8px;
                    overflow: hidden;
                }
                .header {
                    background: linear-gradient(135deg, #0a0a0a 0%, #111111 100%);
                    padding: 30px;
                    text-align: center;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
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
                }
                .button {
                    display: inline-block;
                    background: #ffffff;
                    color: #0a0a0a;
                    padding: 14px 28px;
                    text-decoration: none;
                    border-radius: 4px;
                    font-weight: 600;
                    margin: 20px 0;
                    transition: all 0.3s ease;
                }
                .button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(255,255,255,0.1);
                }
                .footer {
                    background: rgba(255,255,255,0.03);
                    padding: 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #888888;
                    border-top: 1px solid rgba(255,255,255,0.1);
                }
                .warning {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    padding: 15px;
                    border-radius: 4px;
                    margin: 20px 0;
                    font-size: 12px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">NEXA</div>
                    <p style="color: #888; margin: 0;">Réinitialisation de mot de passe</p>
                </div>
                <div class="content">
                    <h2 style="color: #fff; margin-bottom: 20px;">Bonjour,</h2>
                    <p style="color: #e0e0e0; line-height: 1.6;">
                        Vous avez demandé la réinitialisation de votre mot de passe NEXA.
                        Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :
                    </p>
                    
                    <div style="text-align: center;">
                        <a href="${reset_link}" class="button">
                            Réinitialiser mon mot de passe
                        </a>
                    </div>

                    <div class="warning">
                        <strong>⚠️ Important :</strong> Ce lien expirera dans 24 heures.
                        Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
                    </div>

                    <p style="color: #888; font-size: 12px; margin-top: 30px;">
                        Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
                        <a href="${reset_link}" style="color: #fff; word-break: break-all;">${reset_link}</a>
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

    if (!response.ok) {
      console.error('Brevo API error:', result);
      return res.status(500).json({ 
        error: 'Failed to send email',
        details: result.message 
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
    console.error('Error sending reset email:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
