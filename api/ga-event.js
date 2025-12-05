// /api/ga-event.js - VERSION DEBUG COMPLÈTE
export default async function handler(req, res) {
  console.log('=== 🐛 DEBUG API GA ===');
  console.log('Méthode:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', req.headers);
  
  // Accepter GET pour debug
  if (req.method === 'GET') {
    console.log('🔍 GET request - Debug mode');
    
    // Récupérer TOUTES les variables d'environnement
    const allEnvVars = process.env;
    const gaVars = {};
    
    for (const [key, value] of Object.entries(allEnvVars)) {
      if (key.includes('GA') || key.includes('VERCEL') || key.includes('ENV')) {
        gaVars[key] = key.includes('SECRET') || key.includes('KEY') 
          ? (value ? '***PRESENT***' : 'ABSENT') 
          : value || 'UNDEFINED';
      }
    }
    
    return res.status(200).json({
      status: 'API GA - DEBUG MODE',
      timestamp: new Date().toISOString(),
      deployment: {
        environment: process.env.VERCEL_ENV,
        region: process.env.VERCEL_REGION,
        url: process.env.VERCEL_URL
      },
      google_analytics: {
        measurement_id: process.env.GA_MEASUREMENT_ID || 'NOT SET',
        api_secret: process.env.GA_API_SECRET ? '***CONFIGURED***' : 'NOT SET ❌',
        api_secret_length: process.env.GA_API_SECRET?.length || 0
      },
      all_relevant_env_vars: gaVars,
      request_info: {
        method: req.method,
        url: req.url,
        ip: req.headers['x-forwarded-for'] || req.headers['x-real-ip']
      },
      help: 'Si GA_API_SECRET est "NOT SET", configurez-le dans Vercel → Settings → Environment Variables'
    });
  }
  
  // Autoriser OPTIONS pour CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }
  
  // Vérifier méthode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method Not Allowed',
      allowed: ['POST', 'GET (debug)', 'OPTIONS'],
      hint: 'Utilisez GET pour debug ou POST pour envoyer des données'
    });
  }

  try {
    console.log('📦 Body reçu:', JSON.stringify(req.body, null, 2));
    
    const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID || 'G-NJLCB6G0G8';
    const GA_API_SECRET = process.env.GA_API_SECRET;
    
    console.log('🔧 Configuration:');
    console.log('- GA_MEASUREMENT_ID:', GA_MEASUREMENT_ID);
    console.log('- GA_API_SECRET:', GA_API_SECRET ? 'PRESENT' : 'ABSENT ❌');
    
    if (!GA_API_SECRET) {
      console.error('❌ ERREUR: GA_API_SECRET manquant');
      console.log('Variables d\'environnement disponibles:', Object.keys(process.env));
      
      return res.status(200).json({ 
        error: 'API_SECRET manquant dans Vercel',
        debug: {
          measurement_id: GA_MEASUREMENT_ID,
          api_secret: 'NOT FOUND',
          all_env_vars: Object.keys(process.env).filter(k => k.includes('GA') || k.includes('SECRET') || k.includes('KEY')),
          vercel_env: process.env.VERCEL_ENV
        },
        solution: '1. Allez dans Vercel Dashboard → Projet → Settings → Environment Variables\n2. Ajoutez GA_API_SECRET avec votre clé\n3. Redéployez'
      });
    }
    
    console.log('✅ API_SECRET trouvé, longueur:', GA_API_SECRET.length);
    
    const eventData = req.body;
    const eventName = eventData.events?.[0]?.name || 'unknown';
    
    console.log(`📡 Envoi à GA: ${eventName}`);
    
    const gaUrl = `https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`;
    console.log('🔗 URL GA:', gaUrl.replace(GA_API_SECRET, '***SECRET***'));
    
    const response = await fetch(gaUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'Vercel-API/1.0'
      },
      body: JSON.stringify(eventData),
    });
    
    console.log('📤 Réponse GA:', response.status, response.statusText);
    
    const responseText = await response.text();
    console.log('📄 Contenu réponse:', responseText);
    
    return res.status(response.ok ? 200 : 500).json({ 
      success: response.ok,
      ga_status: response.status,
      ga_response: response.statusText,
      event_sent: eventName,
      debug: {
        measurement_id: GA_MEASUREMENT_ID,
        api_secret_length: GA_API_SECRET.length,
        url_used: gaUrl.replace(GA_API_SECRET, '***SECRET***')
      }
    });
    
  } catch (error) {
    console.error('💥 ERREUR API GA:', error);
    console.error('Stack:', error.stack);
    
    return res.status(200).json({ 
      error: 'Exception',
      message: error.message,
      type: error.constructor.name,
      ga_standard: 'fonctionnel (gtag() marche toujours)',
      debug: {
        node_version: process.version,
        timestamp: new Date().toISOString()
      }
    });
  }
}
