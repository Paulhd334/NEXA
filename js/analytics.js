// =============== GOOGLE ANALYTICS 4 - Version avec API sécurisée ===============
const GA_MEASUREMENT_ID = 'G-NJLCB6G0G8';
let isGALoaded = false;
let deviceType = 'desktop';
let clientId = null;

// =============== DÉTECTION DU DEVICE ===============
function detectDeviceType() {
    const width = window.innerWidth;
    const ua = navigator.userAgent.toLowerCase();
    
    if (/mobile|android|iphone|ipad|ipod/i.test(ua) || width <= 768) {
        return width <= 480 ? 'mobile' : 'tablet';
    }
    return 'desktop';
}

// =============== MAPPING DES PAGES ===============
function getPageTitle() {
    const path = window.location.pathname;
    const pageMap = {
        '/': 'UNWARE STUDIO',
        '/index.html': 'UNWARE STUDIO',
        '/nexa/fonctionnalites.html': 'Fonctionnalités NEXA',
        '/nexa/galerie.html': 'Galerie NEXA',
        '/nexa/nexa.html': 'NEXA',
        '/create-account.html': 'Créer compte',
        '/login.html': 'Connexion',
        '/Support/FAQ.html': 'FAQ Support',
        '/Support/centre-aide.html': 'Centre aide',
        '/Support/contact.html': 'Contact',
        '/Support/statut.html': 'Statut services',
        '/legals/mentions-legales.html': 'Mentions légales',
        '/legals/conditions-utilisation.html': 'Conditions utilisation',
        '/legals/politique-confidentialite.html': 'Politique confidentialité',
        '/legals/politique-cookies.html': 'Politique cookies'
    };
    return pageMap[path] || document.title || 'UNWARE STUDIO';
}

function getPagePath() {
    return window.location.pathname + window.location.search;
}

// =============== CLIENT ID ===============
function getClientId() {
    if (!clientId) {
        // Générer ou récupérer client ID
        clientId = localStorage.getItem('ga_client_id');
        if (!clientId) {
            clientId = 'cid_' + Date.now() + '_' + Math.random().toString(36).substr(2, 12);
            localStorage.setItem('ga_client_id', clientId);
        }
    }
    return clientId;
}

// =============== GESTION DES COOKIES ===============
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
    }
    return null;
}

function shouldLoadGA() {
    const consent = getCookie('cookieConsent');
    const analytics = getCookie('analyticsCookies');
    return consent && (consent === 'all' || (consent === 'custom' && analytics === 'true'));
}

// =============== API SÉCURISÉE VERCEL ===============
async function sendToSecureAPI(eventName, params = {}) {
    if (!shouldLoadGA()) return false;
    
    try {
        const payload = {
            client_id: getClientId(),
            user_id: getCookie('user_id') || null,
            timestamp_micros: Math.floor(Date.now() * 1000),
            events: [{
                name: eventName,
                params: {
                    page_title: getPageTitle(),
                    page_location: window.location.href,
                    page_path: getPagePath(),
                    device_type: deviceType,
                    screen_resolution: `${window.screen.width}x${window.screen.height}`,
                    user_agent: navigator.userAgent.substring(0, 100),
                    ...params
                }
            }]
        };
        
        // Envoyer à votre API Vercel
        const response = await fetch('/api/ga-event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            // Important pour éviter les blocages
            keepalive: true,
            mode: 'cors',
            credentials: 'omit'
        });
        
        if (response.ok) {
            console.log(`📡 [API] Événement envoyé: ${eventName}`);
            return true;
        } else {
            console.warn(`⚠️ [API] Erreur: ${response.status}`);
            return false;
        }
        
    } catch (error) {
        console.warn('⚠️ [API] Erreur connexion:', error);
        return false;
    }
}

// =============== INITIALISATION GA4 STANDARD ===============
function initializeGoogleAnalytics() {
    if (isGALoaded) {
        console.log('✅ GA déjà chargé');
        return;
    }
    
    if (!shouldLoadGA()) {
        console.log('⛔ Pas de consentement GA');
        return;
    }
    
    console.log('🚀 Initialisation GA4...');
    
    // ========== 1. ENVOI SÉCURISÉ (API Vercel) ==========
    sendToSecureAPI('page_view', {
        engagement_time_msec: '100',
        session_id: 'session_' + Date.now()
    });
    
    // ========== 2. INITIALISATION STANDARD (fallback) ==========
    // Créer dataLayer
    window.dataLayer = window.dataLayer || [];
    
    // Définir gtag
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    
    // Initialiser
    gtag('js', new Date());
    
    // Configurer GA
    gtag('config', GA_MEASUREMENT_ID, {
        'page_title': getPageTitle(),
        'page_location': window.location.href,
        'page_path': getPagePath(),
        'device_type': deviceType,
        'anonymize_ip': true,
        'allow_google_signals': false,
        'client_id': getClientId()
    });
    
    // Envoyer page_view standard
    gtag('event', 'page_view', {
        'page_title': getPageTitle(),
        'page_location': window.location.href,
        'page_path': getPagePath(),
        'device_type': deviceType
    });
    
    // Charger le script Google
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    
    script.onload = function() {
        console.log('✅ Script GA chargé');
        isGALoaded = true;
        initEventTracking();
    };
    
    script.onerror = function() {
        console.error('❌ Erreur chargement GA script');
        isGALoaded = true; // On continue avec l'API sécurisée
        initEventTracking();
    };
    
    document.head.appendChild(script);
}

// =============== TRACKING DES ÉVÉNEMENTS ===============
function initEventTracking() {
    console.log('🎯 Activation tracking...');
    
    // Clics
    document.addEventListener('click', function(e) {
        setTimeout(() => {
            trackClick(e.target);
            trackClickSecure(e.target);
        }, 50);
    }, { passive: true });
    
    // Formulaires
    document.addEventListener('submit', function(e) {
        trackFormSubmit(e.target);
        trackFormSubmitSecure(e.target);
    });
}

// Tracking standard
function trackClick(element) {
    if (!window.gtag || !element) return;
    
    const interactiveEl = element.closest('a, button, .btn');
    if (!interactiveEl) return;
    
    const text = interactiveEl.textContent?.trim()?.substring(0, 100) || 
                 interactiveEl.getAttribute('aria-label') || 
                 'unknown';
    
    gtag('event', 'click', {
        'event_category': 'engagement',
        'event_label': text,
        'element_type': interactiveEl.tagName.toLowerCase(),
        'page_title': getPageTitle()
    });
}

// Tracking sécurisé
function trackClickSecure(element) {
    const interactiveEl = element.closest('a, button, .btn');
    if (!interactiveEl) return;
    
    const text = interactiveEl.textContent?.trim()?.substring(0, 100) || 
                 interactiveEl.getAttribute('aria-label') || 
                 'unknown';
    
    sendToSecureAPI('click', {
        event_category: 'engagement',
        event_label: text,
        element_type: interactiveEl.tagName.toLowerCase(),
        engagement_time_msec: '50'
    });
}

function trackFormSubmit(form) {
    if (!window.gtag) return;
    
    gtag('event', 'form_submit', {
        'event_category': 'form',
        'event_label': form.id || 'form_submit',
        'form_id': form.id || 'unknown',
        'page_title': getPageTitle()
    });
}

function trackFormSubmitSecure(form) {
    sendToSecureAPI('form_submit', {
        event_category: 'form',
        event_label: form.id || 'form_submit',
        form_id: form.id || 'unknown',
        engagement_time_msec: '100'
    });
}

// =============== GESTION COOKIES UI ===============
function attachCookieEvents() {
    document.addEventListener('click', function(e) {
        const target = e.target;
        
        if (target.closest('.cookie-btn.accept')) {
            setTimeout(() => initializeGoogleAnalytics(), 100);
        }
    });
}

// =============== INITIALISATION PRINCIPALE ===============
function initAnalytics() {
    console.log('🌐 Initialisation analytics...');
    
    // Détecter device
    deviceType = detectDeviceType();
    console.log('📱 Device:', deviceType);
    
    // Attacher événements cookies
    attachCookieEvents();
    
    // Vérifier consentement
    if (shouldLoadGA()) {
        console.log('✅ Consentement OK, chargement GA...');
        setTimeout(() => initializeGoogleAnalytics(), 300);
    } else {
        console.log('🔄 En attente consentement...');
        setTimeout(showCookieBanner, 1500);
    }
}

function showCookieBanner() {
    const banner = document.getElementById('custom-cookie-banner');
    if (banner && !getCookie('cookieConsent')) {
        banner.style.display = 'block';
        setTimeout(() => banner.classList.add('show'), 10);
    }
}

// =============== DÉMARRAGE ===============
document.addEventListener('DOMContentLoaded', initAnalytics);

// =============== DEBUG ===============
window.debugGA = {
    check: function() {
        console.log('🔍 État GA:');
        console.log('- gtag exists:', typeof gtag !== 'undefined');
        console.log('- GA Loaded:', isGALoaded);
        console.log('- Page:', getPageTitle());
        console.log('- Device:', deviceType);
        console.log('- Client ID:', getClientId());
        console.log('- Consent:', getCookie('cookieConsent'));
        console.log('- Analytics cookies:', getCookie('analyticsCookies'));
    },
    
    test: function() {
        // Test standard
        if (window.gtag) {
            gtag('event', 'debug_test', {
                'test': 'ok',
                'timestamp': Date.now()
            });
            console.log('✅ Événement test envoyé (standard)');
        } else {
            console.log('❌ gtag non disponible');
        }
        
        // Test API sécurisée
        sendToSecureAPI('debug_test', {
            test: 'api_secure',
            timestamp: Date.now()
        }).then(success => {
            console.log(success ? '✅ Événement test envoyé (API)' : '❌ Échec API');
        });
    },
    
    force: function() {
        initializeGoogleAnalytics();
    },
    
    apiTest: function() {
        return sendToSecureAPI('api_test', { test: 'direct' });
    }
};

console.log('📊 Analytics Manager prêt - Double système activé');
