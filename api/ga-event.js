// /api/ga-event.js - VERSION HARCODED (TEMPORAIRE)
export default async function handler(req, res) {
  console.log('🚨 API GA - Version hardcodée');
  
  // Clés hardcodées TEMPORAIREMENT
  const MEASUREMENT_ID = 'G-NJLCB6G0G8';
  const API_SECRET = 'Qx7UjLWGTtq7Cob1-PnLFg'; // ⚠️ TEMPORAIRE
  
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'API GA (hardcoded)',
      warning: '⚠️ API_SECRET exposé - À CHANGER APRÈS DEBUG',
      measurement_id: MEASUREMENT_ID,
      api_secret: API_SECRET.substring(0, 10) + '...'
    });
  }
  
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const eventData = req.body;
    const gaUrl = `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`;
    
    console.log('📡 Envoi à GA...');
    const response = await fetch(gaUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });
    
    return res.status(response.ok ? 200 : 500).json({
      success: response.ok,
      status: response.status
    });
    
  } catch (error) {
    console.error('Erreur:', error);
    return res.status(200).json({ error: error.message });
  }
}
