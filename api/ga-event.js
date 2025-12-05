// /api/ga-event.js - CORRECT
export default async function handler(req, res) {
  // Autoriser les requêtes OPTIONS pour CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }
  
  // Seulement POST accepté
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method Not Allowed',
      allowed: ['POST', 'OPTIONS'] 
    });
  }

  try {
    const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID || 'G-NJLCB6G0G8';
    const GA_API_SECRET = process.env.GA_API_SECRET;

    if (!GA_API_SECRET) {
      return res.status(200).json({ 
        warning: 'API_SECRET manquant dans Vercel',
        ga_standard: 'fonctionnel'
      });
    }

    const eventData = req.body;
    
    const gaUrl = `https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`;
    
    const response = await fetch(gaUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });

    return res.status(response.ok ? 200 : 500).json({ 
      success: response.ok,
      ga_status: response.status
    });
    
  } catch (error) {
    console.error('API GA error:', error);
    return res.status(200).json({ 
      error: 'Exception',
      ga_standard: 'fonctionnel' // Le gtag() standard marche toujours
    });
  }
}
