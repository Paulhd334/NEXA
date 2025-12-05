// /api/ga-event.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID || 'G-NJLCB6G0G8';
    const GA_API_SECRET = process.env.GA_API_SECRET;

    if (!GA_API_SECRET) {
      console.error('API_SECRET manquant');
      return res.status(500).json({ error: 'Configuration manquante' });
    }

    const eventData = req.body;
    
    const gaUrl = `https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`;
    
    const response = await fetch(gaUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      console.error('Erreur GA:', await response.text());
    }

    return res.status(200).json({ success: true });
    
  } catch (error) {
    console.error('Erreur API GA:', error);
    return res.status(500).json({ error: 'Erreur interne' });
  }
}
