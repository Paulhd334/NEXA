// /api/send-reset-email.js
export default async function handler(req, res) {
  // CORS pour Vercel
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
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Configuration Brevo
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const BREVO_SENDER_EMAIL = 'contact.unwarestudio@gmail.com';
    const BREVO_SENDER_NAME = 'NEXA';

    if (!BREVO_API_KEY) {
      return res.status(500).json({ error: 'Email service not configured' });
    }

    // Utiliser le flux Supabase standard pour le lien
    const resetLink = `https://nexa-neon.vercel.app/account/update-password.html`;

    const emailData = {
      sender: {
        email: BREVO_SENDER_EMAIL,
        name: BREVO_SENDER_NAME
      },
      to: [{ email: email }],
      subject: 'Réinitialisation de votre mot de passe NEXA',
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .header { background: #000; padding: 30px; text-align: center; color: white; }
                .logo { font-size: 32px; font-weight: bold; margin-bottom: 10px; }
                .content { padding: 30px; }
                .button { display: inline-block; background: #000; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { background: #f9f9f9; padding: 20px; text-align: center; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">NEXA</div>
                    <p>Réinitialisation de mot de passe</p>
                </div>
                <div class="content">
                    <h2>Bonjour,</h2>
                    <p>Cliquez sur le bouton pour réinitialiser votre mot de passe :</p>
                    <div style="text-align: center;">
                        <a href="${resetLink}" class="button">Réinitialiser mon mot de passe</a>
                    </div>
                    <p><small>Vous recevrez un email de Supabase avec le lien de réinitialisation complet.</small></p>
                </div>
                <div class="footer">
                    <p>NEXA &copy; 2025</p>
                </div>
            </div>
        </body>
        </html>
      `
    };

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
      throw new Error(result.message || 'Brevo API error');
    }

    return res.status(200).json({
      success: true,
      message: 'Email sent successfully'
    });

  } catch (error) {
    return res.status(500).json({ 
      error: 'Failed to send email: ' + error.message
    });
  }
}
