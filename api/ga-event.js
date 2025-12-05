// /api/ga-event.js - VERSION SÉCURISÉE FINALE
export default async function handler(req, res) {
  // Ne pas exposer d'informations sensibles
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'API GA - Sécurisé',
      message: 'Utilisez POST pour envoyer des données',
      hint: 'Les clés sont dans les variables d\'environnement Vercel'
    });
  }
  
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // IMPORTANT: Les clés DOIVENT être dans les variables d'environnement
    const MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID || 'G-NJLCB6G0G8';
    const API_SECRET = process.env.API_SECRET || process.env.GA_API_SECRET;
    
    if (!API_SECRET) {
      // NE PAS exposer d'erreurs détaillées
      return res.status(200).json({ 
        status: 'ok',
        ga_standard: 'fonctionnel'
      });
    }
    
    const eventData = req.body;
    const gaUrl = `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`;
    
    const response = await fetch(gaUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });
    
    // Réponse simple
    return res.status(response.ok ? 200 : 200).json({ 
      status: response.ok ? 'sent' : 'ga_error'
    });
    
  } catch (error) {
    return res.status(200).json({ status: 'error' });
  }
}
