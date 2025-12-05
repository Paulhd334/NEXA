// =============== GOOGLE ANALYTICS 4 - Version SANS API_SECRET ===============
// L'API_SECRET doit être côté serveur uniquement !

const GA_MEASUREMENT_ID = 'G-NJLCB6G0G8';
let isGALoaded = false;
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
    if (isGALoaded) {
        console.log('✅ GA déjà chargé');
        return;
    }
    
    if (!shouldLoadGA()) {
        console.log('⛔ Pas de consentement GA');
        return;
    }
    
    console.log('🚀 Initialisation GA4...');
    
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
        'allow_google_signals': false
    });
    
    // Envoyer page_view
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
        console.error('❌ Erreur chargement GA');
    };
    
    document.head.appendChild(script);
}

// =============== TRACKING DES ÉVÉNEMENTS ===============
function initEventTracking() {
    console.log('🎯 Activation tracking...');
    
    // Clics
    document.addEventListener('click', function(e) {
        setTimeout(() => trackClick(e.target), 50);
    }, { passive: true });
    
    // Formulaires
    document.addEventListener('submit', function(e) {
        trackFormSubmit(e.target);
    });
}

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

function trackFormSubmit(form) {
    if (!window.gtag) return;
    
    gtag('event', 'form_submit', {
        'event_category': 'form',
        'event_label': form.id || 'form_submit',
        'form_id': form.id || 'unknown',
        'page_title': getPageTitle()
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
        console.log('- Consent:', getCookie('cookieConsent'));
        console.log('- Analytics cookies:', getCookie('analyticsCookies'));
    },
    
    test: function() {
        if (window.gtag) {
            gtag('event', 'debug_test', {
                'test': 'ok',
                'timestamp': Date.now()
            });
            console.log('✅ Événement test envoyé');
        } else {
            console.log('❌ gtag non disponible');
        }
    },
    
    force: function() {
        initializeGoogleAnalytics();
    }
};

console.log('📊 Analytics Manager prêt');
