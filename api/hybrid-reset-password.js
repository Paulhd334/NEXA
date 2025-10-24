// /api/hybrid-reset-password.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { email } = req.body;
    
    console.log('📧 Reset request for:', email);

    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    // 1. Vérifier que l'utilisateur existe (sans rate limit)
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
    const SUPABASE_URL = 'https://itnrlxfbejgxbibezoup.supabase.co';

    const userResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?email=${encodeURIComponent(email)}`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY
      }
    });

    let userExists = false;
    if (userResponse.ok) {
      const users = await userResponse.json();
      userExists = users.length > 0;
    }

    // 2. Générer un token sécurisé
    const token = Buffer.from(`${Date.now()}:${email}:${Math.random().toString(36)}`).toString('base64');
    const resetLink = `https://nexa-neon.vercel.app/account/update-password.html?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;

    // 3. Envoyer l'email via Brevo (TOUJOURS, même si user n'existe pas - pour la sécurité)
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    
    const emailData = {
      sender: {
        email: 'contact.unwarestudio@gmail.com',
        name: 'NEXA'
      },
      to: [{ email: email }],
      subject: 'Réinitialisation de mot de passe NEXA',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="background: #000; padding: 30px; text-align: center; color: white;">
            <div style="font-size: 32px; font-weight: bold; margin-bottom: 10px;">NEXA</div>
            <p>Réinitialisation de mot de passe</p>
          </div>
          <div style="padding: 30px;">
            <h2>Bonjour,</h2>
            <p>Cliquez sur le bouton pour réinitialiser votre mot de passe :</p>
            <div style="text-align: center;">
              <a href="${resetLink}" style="background: #000; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; display: inline-block;">
                Réinitialiser mon mot de passe
              </a>
            </div>
            <p><small>Ce lien expirera dans 24 heures.</small></p>
            <p>Si le bouton ne fonctionne pas, copiez ce lien :<br>${resetLink}</p>
          </div>
          <div style="background: #f9f9f9; padding: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>NEXA &copy; 2025</p>
          </div>
        </div>
      `
    };

    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!brevoResponse.ok) {
      const brevoError = await brevoResponse.json();
      throw new Error(brevoError.message || 'Erreur envoi email Brevo');
    }

    console.log('✅ Email Brevo envoyé avec succès');
    
    // Message de sécurité (ne pas dire si l'email existe ou non)
    return res.status(200).json({ 
      success: true, 
      message: '✅ Si cet email existe dans notre système, vous recevrez un lien de réinitialisation.' 
    });

  } catch (error) {
    console.error('💥 Error:', error);
    return res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
}
