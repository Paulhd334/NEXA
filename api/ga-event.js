// Fichier: /api/ga-event.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID || 'G-NJLCB6G0G8';
    const GA_API_SECRET = process.env.GA_API_SECRET; // Votre secret dans Vercel

    if (!GA_API_SECRET) {
      return res.status(500).json({ error: 'Configuration GA manquante' });
    }

    const event = req.body;
    
    // URL GA4 avec API_SECRET sécurisé
    const gaUrl = `https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`;
    
    const response = await fetch(gaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    return res.status(200).json({ success: true });
    
  } catch (error) {
    console.error('Erreur GA:', error);
    return res.status(500).json({ error: 'Erreur interne' });
  }
}
