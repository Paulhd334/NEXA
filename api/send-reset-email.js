// /api/send-reset-email.js
export default async function handler(req, res) {
  // Configuration CORS plus robuste
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, reset_link } = req.body;

    console.log('📧 Receiving reset request:', { 
      email, 
      reset_link: reset_link ? 'Provided' : 'Missing',
      timestamp: new Date().toISOString() 
    });

    // Validation renforcée
    if (!email || !reset_link) {
      console.error('❌ Missing parameters:', { 
        hasEmail: !!email, 
        hasResetLink: !!reset_link 
      });
      return res.status(400).json({ 
        error: 'Email and reset_link are required',
        details: {
          email: email ? 'Provided' : 'Missing',
          reset_link: reset_link ? 'Provided' : 'Missing'
        }
      });
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('❌ Invalid email format:', email);
      return res.status(400).json({ 
        error: 'Invalid email format' 
      });
    }

    // Configuration Brevo
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || 'contact.unwarestudio@gmail.com';
    const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME || 'NEXA';

    console.log('🔑 Brevo configuration check:', { 
      hasApiKey: !!BREVO_API_KEY,
      senderEmail: BREVO_SENDER_EMAIL,
      senderName: BREVO_SENDER_NAME
    });

    if (!BREVO_API_KEY) {
      console.error('❌ Brevo API key not configured');
      return res.status(500).json({ 
        error: 'Email service not configured',
        details: 'BREVO_API_KEY is missing from environment variables'
      });
    }

    // Template email amélioré
    const emailTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialisation de mot de passe NEXA</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Bebas+Neue&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Inter', Arial, sans-serif; 
            background: linear-gradient(135deg, #0a0a0a 0%, #111111 100%);
            color: #e0e0e0;
            margin: 0;
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        .header {
            background: rgba(255, 255, 255, 0.05);
            padding: 40px 30px;
            text-align: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .logo {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 42px;
            color: #ffffff;
            letter-spacing: 3px;
            margin-bottom: 10px;
        }
        .tagline {
            opacity: 0.8;
            font-size: 14px;
            letter-spacing: 1px;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #ffffff;
        }
        .message {
            line-height: 1.6;
            margin-bottom: 30px;
            color: #e0e0e0;
        }
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        .reset-button {
            display: inline-block;
            background: #ffffff;
            color: #0a0a0a;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: 600;
            font-size: 15px;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
        }
        .reset-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 255, 255, 0.2);
        }
        .warning {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            padding: 15px;
            border-radius: 4px;
            margin: 25px 0;
            font-size: 13px;
            color: #ef4444;
        }
        .link-backup {
            background: rgba(255, 255, 255, 0.05);
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
            word-break: break-all;
            font-size: 12px;
            color: #888;
        }
        .footer {
            background: rgba(255, 255, 255, 0.02);
            padding: 25px;
            text-align: center;
            font-size: 12px;
            color: #888;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .support {
            margin-top: 15px;
            font-size: 11px;
            opacity: 0.7;
        }
        @media (max-width: 480px) {
            .container { margin: 10px; }
            .header { padding: 30px 20px; }
            .content { padding: 30px 20px; }
            .logo { font-size: 36px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">NEXA</div>
            <div class="tagline">RÉINITIALISATION DE MOT DE PASSE</div>
        </div>
        <div class="content">
            <h2 class="greeting">Bonjour,</h2>
            <p class="message">
                Vous avez demandé la réinitialisation de votre mot de passe NEXA.
                Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe sécurisé.
            </p>
            
            <div class="button-container">
                <a href="${reset_link}" class="reset-button">
                    🔐 Réinitialiser mon mot de passe
                </a>
            </div>

            <div class="warning">
                <strong>⚠️ Sécurité :</strong> Ce lien est valable pendant 24 heures uniquement.
                Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email et sécuriser votre compte.
            </div>

            <div class="link-backup">
                <strong>Lien alternatif :</strong><br>
                <a href="${reset_link}" style="color: #888; text-decoration: none;">${reset_link}</a>
            </div>
        </div>
        <div class="footer">
            <p>&copy; 2025 UNWARE STUDIO. Tous droits réservés.</p>
            <p>Cet email a été envoyé à <strong>${email}</strong></p>
            <div class="support">
                Besoin d'aide ? Contactez notre support à contact.unwarestudio@gmail.com
            </div>
        </div>
    </div>
</body>
</html>
    `;

    const textTemplate = `
RÉINITIALISATION DE MOT DE PASSE - NEXA

Bonjour,

Vous avez demandé la réinitialisation de votre mot de passe NEXA.

Pour créer un nouveau mot de passe sécurisé, cliquez sur le lien suivant :
${reset_link}

⚠️ SÉCURITÉ :
- Ce lien est valable 24 heures
- Ne partagez jamais ce lien
- Si vous n'avez pas fait cette demande, ignorez cet email

Lien alternatif (copiez-collez dans votre navigateur) :
${reset_link}

--
© 2025 UNWARE STUDIO
Email envoyé à : ${email}
Support : contact.unwarestudio@gmail.com
    `;

    // Préparation des données Brevo
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
      htmlContent: emailTemplate,
      textContent: textTemplate
    };

    console.log('📤 Sending email via Brevo API...');

    // Envoi via Brevo avec timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify(emailData),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const result = await response.json();

    console.log('📨 Brevo API response:', {
      status: response.status,
      statusText: response.statusText,
      messageId: result.messageId,
      success: response.ok
    });

    if (!response.ok) {
      console.error('❌ Brevo API error:', {
        status: response.status,
        error: result
      });
      
      let errorMessage = 'Failed to send email';
      if (result.code === 'unauthorized') {
        errorMessage = 'Email service configuration error';
      } else if (result.code === 'invalid_parameter') {
        errorMessage = 'Invalid email parameters';
      }
      
      return res.status(500).json({ 
        error: errorMessage,
        details: result.message || 'Unknown Brevo API error',
        code: result.code
      });
    }

    console.log('✅ Reset email sent successfully to:', email);
    console.log('📧 Brevo Message ID:', result.messageId);

    return res.status(200).json({
      success: true,
      message: 'Reset email sent successfully',
      messageId: result.messageId,
      recipient: email
    });

  } catch (error) {
    console.error('💥 Critical error sending reset email:', error);
    
    if (error.name === 'AbortError') {
      return res.status(408).json({ 
        error: 'Email service timeout',
        details: 'The email service took too long to respond'
      });
    }
    
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
