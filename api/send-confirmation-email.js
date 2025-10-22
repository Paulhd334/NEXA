// Fichier: /api/send-confirmation-email.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, firstname, confirmationLink } = req.body;

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY // 🔒 Clé sécurisée
      },
      body: JSON.stringify({
        sender: {
          name: 'NEXA - UNWARE STUDIO',
          email: 'contact.unwarestudio@gmail.com'
        },
        to: [{ email, name: firstname }],
        subject: 'Confirmez votre compte NEXA',
        htmlContent: `... (le même HTML que précédemment) ...`
      })
    });

    if (!response.ok) {
      throw new Error('Erreur Brevo');
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}