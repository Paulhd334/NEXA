// =============== GOOGLE ANALYTICS 4 - Version Fonctionnelle ===============
// Date: 2024
// GA4 ID: G-NJLCB6G0G8
// Tous appareils, toutes pages

// =============== CONFIGURATION ===============
const GA_MEASUREMENT_ID = 'G-NJLCB6G0G8';
let isGAInitialized = false;
let deviceType = 'desktop';

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
        '/': 'Accueil - UNWARE STUDIO',
        '/index.html': 'Accueil - UNWARE STUDIO',
        '/nexa/fonctionnalites.html': 'Fonctionnalités - NEXA',
        '/nexa/galerie.html': 'Galerie - NEXA',
        '/nexa/nexa.html': 'NEXA - Présentation',
        '/create-account.html': 'Créer un compte - UNWARE STUDIO',
        '/login.html': 'Connexion - UNWARE STUDIO',
        '/Support/FAQ.html': 'FAQ - Support NEXA',
        '/Support/centre-aide.html': 'Centre d\'aide - NEXA',
        '/Support/contact.html': 'Contact - UNWARE STUDIO',
        '/Support/statut.html': 'Statut des services - NEXA',
        '/legals/mentions-legales.html': 'Mentions légales - UNWARE STUDIO',
        '/legals/conditions-utilisation.html': 'Conditions d\'utilisation - NEXA',
        '/legals/politique-confidentialite.html': 'Politique de confidentialité - UNWARE STUDIO',
        '/legals/politique-cookies.html': 'Politique de cookies - UNWARE STUDIO'
    };
    
    return pageMap[path] || document.title || 'UNWARE STUDIO';
}

function getPagePath() {
    return window.location.pathname + window.location.search;
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

// =============== INITIALISATION GA4 ===============
function initializeGoogleAnalytics() {
    if (isGAInitialized) {
        console.log('✅ GA déjà initialisé');
        return true;
    }
    
    if (!shouldLoadGA()) {
        console.log('⛔ Pas de consentement pour GA');
        return false;
    }
    
    console.log('🚀 Initialisation GA4...');
    
    // Créer dataLayer
    window.dataLayer = window.dataLayer || [];
    
    // Définir gtag
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    
    // Initialiser
    gtag('js', new Date());
    
    // Configurer avec options minimales
    gtag('config', GA_MEASUREMENT_ID, {
        'page_title': getPageTitle(),
        'page_location': window.location.href,
        'page_path': getPagePath(),
        'device_type': deviceType,
        'debug_mode': false
    });
    
    // Envoyer page_view immédiatement
    sendPageView();
    
    isGAInitialized = true;
    console.log('🎯 GA4 initialisé avec succès');
    
    // Charger le script Google
    loadGAScript();
    
    return true;
}

function loadGAScript() {
    // Vérifier si déjà chargé
    if (document.querySelector('script[src*="googletagmanager.com"]')) {
        return;
    }
    
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    
    script.onload = function() {
        console.log('📡 Script GA chargé');
        // Tracking avancé
        initEventTracking();
    };
    
    script.onerror = function() {
        console.error('❌ Erreur chargement script GA');
    };
    
    document.head.appendChild(script);
}

function sendPageView() {
    if (!window.gtag) return;
    
    const pageData = {
        'page_title': getPageTitle(),
        'page_location': window.location.href,
        'page_path': getPagePath(),
        'device_type': deviceType,
        'user_agent': navigator.userAgent.substring(0, 100)
    };
    
    // Envoyer via gtag
    gtag('event', 'page_view', pageData);
    
    // ENVOYER DIRECTEMENT AUX ENDPOINTS GA4 (garantie)
    sendDirectToGA('page_view', pageData);
    
    console.log('📤 Page View envoyée:', getPageTitle());
}

// =============== ENVOI DIRECT À GA4 (GARANTI) ===============
function sendDirectToGA(eventName, params) {
    const measurementId = GA_MEASUREMENT_ID.replace('G-', '');
    const clientId = getClientId();
    const timestamp = Date.now();
    
    // Endpoint 1: collect
    const collectUrl = `https://www.google-analytics.com/g/collect?v=2&tid=${measurementId}&cid=${clientId}&t=${eventName}&dp=${encodeURIComponent(getPagePath())}&dt=${encodeURIComponent(getPageTitle())}&_p=${timestamp}&sr=${window.screen.width}x${window.screen.height}`;
    
    // Endpoint 2: mp/collect (GA4)
    const mpCollectUrl = `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=YOUR_API_SECRET`; // À configurer
    
    // Envoyer via image pixel (garanti)
    sendViaImagePixel(collectUrl);
    
    // Envoyer via fetch (si possible)
    if (navigator.sendBeacon) {
        const data = new FormData();
        data.append('v', '2');
        data.append('tid', measurementId);
        data.append('cid', clientId);
        data.append('t', eventName);
        data.append('dp', getPagePath());
        data.append('dt', getPageTitle());
        data.append('_p', timestamp.toString());
        
        navigator.sendBeacon('https://www.google-analytics.com/g/collect', data);
    }
}

function sendViaImagePixel(url) {
    const img = new Image();
    img.src = url;
    img.style.display = 'none';
    img.onload = function() {
        console.log('📡 Pixel envoyé à GA');
        this.remove();
    };
    document.body.appendChild(img);
}

function getClientId() {
    // Générer un client ID unique
    let clientId = localStorage.getItem('ga_client_id');
    if (!clientId) {
        clientId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('ga_client_id', clientId);
    }
    return clientId;
}

// =============== TRACKING DES ÉVÉNEMENTS ===============
function initEventTracking() {
    console.log('🎯 Initialisation tracking événements');
    
    // Clics
    document.addEventListener('click', function(e) {
        setTimeout(() => trackClick(e.target), 50);
    }, { passive: true });
    
    // Formulaires
    document.addEventListener('submit', function(e) {
        trackFormSubmit(e.target);
    }, { passive: true });
    
    // Scroll
    initScrollTracking();
}

function trackClick(element) {
    if (!window.gtag || !element) return;
    
    const interactiveEl = element.closest('a, button, .btn, [role="button"]');
    if (!interactiveEl) return;
    
    const eventData = {
        'event_category': 'engagement',
        'event_label': getElementText(interactiveEl),
        'element_type': interactiveEl.tagName.toLowerCase(),
        'page_title': getPageTitle()
    };
    
    gtag('event', 'click', eventData);
    sendDirectToGA('click', eventData);
}

function trackFormSubmit(form) {
    if (!window.gtag) return;
    
    const eventData = {
        'event_category': 'form',
        'event_label': form.id || 'form_submit',
        'form_id': form.id || 'unknown',
        'page_title': getPageTitle()
    };
    
    gtag('event', 'form_submit', eventData);
    sendDirectToGA('form_submit', eventData);
}

function initScrollTracking() {
    let scrollTracked = { 25: false, 50: false, 75: false, 90: false };
    
    const trackScroll = function() {
        const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
        
        Object.keys(scrollTracked).forEach(threshold => {
            if (!scrollTracked[threshold] && scrollPercent >= parseInt(threshold)) {
                const eventData = {
                    'event_category': 'engagement',
                    'event_label': `Scroll ${threshold}%`,
                    'scroll_depth': threshold,
                    'page_title': getPageTitle()
                };
                
                if (window.gtag) {
                    gtag('event', 'scroll', eventData);
                }
                sendDirectToGA('scroll', eventData);
                
                scrollTracked[threshold] = true;
            }
        });
    };
    
    window.addEventListener('scroll', trackScroll, { passive: true });
}

function getElementText(element) {
    return element.textContent?.trim()?.substring(0, 100) || 
           element.getAttribute('aria-label') || 
           element.title || 
           element.value || 
           element.placeholder || 
           element.tagName.toLowerCase();
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

// =============== INITIALISATION ===============
function initAnalytics() {
    console.log('🌐 Initialisation analytics...');
    
    // Détecter device
    deviceType = detectDeviceType();
    console.log('📱 Device:', deviceType);
    
    // Attacher événements cookies
    attachCookieEvents();
    
    // Vérifier consentement immédiat
    if (shouldLoadGA()) {
        console.log('✅ Consentement OK, chargement GA...');
        initializeGoogleAnalytics();
    } else {
        console.log('🔄 En attente consentement...');
        // Afficher bannière après délai
        setTimeout(() => {
            const banner = document.getElementById('custom-cookie-banner');
            if (banner && !getCookie('cookieConsent')) {
                banner.style.display = 'block';
                setTimeout(() => banner.classList.add('show'), 10);
            }
        }, 1500);
    }
    
    // Rafraîchir si redimensionnement
    window.addEventListener('resize', function() {
        const newType = detectDeviceType();
        if (newType !== deviceType) {
            deviceType = newType;
            if (isGAInitialized && window.gtag) {
                gtag('event', 'device_change', { 'device_type': deviceType });
            }
        }
    });
}

// =============== DÉMARRAGE ===============
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnalytics);
} else {
    initAnalytics();
}

// =============== DEBUG ===============
window.debugGA = {
    check: function() {
        console.log('🔍 Debug GA4:');
        console.log('- gtag exists:', typeof gtag !== 'undefined');
        console.log('- dataLayer:', window.dataLayer?.length || 0, 'items');
        console.log('- GA Initialized:', isGAInitialized);
        console.log('- Page:', getPageTitle());
        console.log('- Device:', deviceType);
        console.log('- Consent:', getCookie('cookieConsent'));
        console.log('- Analytics cookies:', getCookie('analyticsCookies'));
        
        if (window.dataLayer) {
            console.log('Derniers événements:', window.dataLayer.slice(-5));
        }
    },
    
    test: function() {
        if (window.gtag) {
            gtag('event', 'debug_test', {
                'test': 'ok',
                'timestamp': Date.now()
            });
            console.log('✅ Événement test envoyé via gtag');
        }
        
        // Envoyer directement aussi
        sendDirectToGA('debug_test', { test: 'direct', timestamp: Date.now() });
        console.log('✅ Événement test envoyé directement');
    },
    
    force: function() {
        console.log('🔄 Forcer initialisation GA...');
        initializeGoogleAnalytics();
    },
    
    sendPage: function() {
        sendPageView();
    }
};

console.log('📊 Analytics Manager prêt - GA4 ID:', GA_MEASUREMENT_ID);

// =============== TEST AUTOMATIQUE ===============
// Test d'envoi après 2 secondes
setTimeout(() => {
    if (isGAInitialized) {
        debugGA.test();
    }
}, 2000);
