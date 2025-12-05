// =============== ANALYTICS & COOKIES MANAGER ===============
// Version: 2.0.0 - Tout fonctionnel
// Compatible: PC, Mobile, Tablette, Toutes pages

// VARIABLES GLOBALES
let isGALoaded = false;
let pendingEvents = [];
let pageViewSent = false;
let deviceType = 'desktop';

// =============== DÉTECTION DU DEVICE ===============
function detectDeviceType() {
    const width = window.innerWidth;
    const ua = navigator.userAgent;
    
    if (/mobile|android|iphone|ipad|ipod/i.test(ua) || width <= 768) {
        return width <= 480 ? 'mobile' : 'tablet';
    }
    return 'desktop';
}

// =============== MAPPING DES PAGES ===============
const PAGE_MAPPING = {
    // Accueil
    '/': 'Accueil - UNWARE STUDIO',
    '/index.html': 'Accueil - UNWARE STUDIO',
    
    // Nexa
    '/nexa/fonctionnalites.html': 'Fonctionnalités - NEXA',
    '/nexa/galerie.html': 'Galerie - NEXA',
    '/nexa/nexa.html': 'NEXA - Présentation',
    
    // Comptes
    '/create-account.html': 'Créer un compte - UNWARE STUDIO',
    '/login.html': 'Connexion - UNWARE STUDIO',
    
    // Support
    '/Support/FAQ.html': 'FAQ - Support NEXA',
    '/Support/centre-aide.html': 'Centre d\'aide - NEXA',
    '/Support/contact.html': 'Contact - UNWARE STUDIO',
    '/Support/statut.html': 'Statut des services - NEXA',
    
    // Légal
    '/legals/mentions-legales.html': 'Mentions légales - UNWARE STUDIO',
    '/legals/conditions-utilisation.html': 'Conditions d\'utilisation - NEXA',
    '/legals/politique-confidentialite.html': 'Politique de confidentialité - UNWARE STUDIO',
    '/legals/politique-cookies.html': 'Politique de cookies - UNWARE STUDIO'
};

function getPageTitle() {
    const path = window.location.pathname;
    return PAGE_MAPPING[path] || document.title || 'UNWARE STUDIO';
}

function getPageCategory() {
    const path = window.location.pathname;
    if (path === '/' || path.includes('index')) return 'Accueil';
    if (path.includes('nexa/')) return 'NEXA';
    if (path.includes('create-account') || path.includes('login')) return 'Compte';
    if (path.includes('support/')) return 'Support';
    if (path.includes('legals/')) return 'Légal';
    return 'Autre';
}

// =============== GESTION DES COOKIES ===============
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    const secure = window.location.protocol === 'https:' ? ';Secure' : '';
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax${secure}`;
    return true;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
    }
    return null;
}

// =============== INTERFACE COOKIES ===============
function showCookieBanner() {
    const banner = document.getElementById('custom-cookie-banner');
    if (banner) {
        banner.style.display = 'block';
        setTimeout(() => banner.classList.add('show'), 10);
    }
}

function hideCookieBanner() {
    const banner = document.getElementById('custom-cookie-banner');
    if (banner) banner.classList.remove('show');
}

function showCookieSettings() {
    const modal = document.getElementById('cookieModal');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
        
        const analytics = getCookie('analyticsCookies');
        const performance = getCookie('performanceCookies');
        
        document.getElementById('analyticsCookies').checked = analytics === 'true';
        document.getElementById('performanceCookies').checked = performance === 'true';
    }
}

function hideCookieSettings() {
    const modal = document.getElementById('cookieModal');
    if (modal) modal.classList.remove('show');
}

function acceptCookies() {
    setCookie('cookieConsent', 'all', 365);
    setCookie('analyticsCookies', 'true', 365);
    setCookie('performanceCookies', 'true', 365);
    hideCookieBanner();
    setTimeout(() => loadGoogleAnalytics(true), 100);
}

function rejectCookies() {
    setCookie('cookieConsent', 'necessary', 365);
    setCookie('analyticsCookies', 'false', 365);
    setCookie('performanceCookies', 'false', 365);
    hideCookieBanner();
}

function saveCookiePreferences() {
    const analytics = document.getElementById('analyticsCookies').checked;
    const performance = document.getElementById('performanceCookies').checked;
    
    setCookie('cookieConsent', 'custom', 365);
    setCookie('analyticsCookies', analytics ? 'true' : 'false', 365);
    setCookie('performanceCookies', performance ? 'true' : 'false', 365);
    
    if (analytics) {
        setTimeout(() => loadGoogleAnalytics(true), 100);
    } else {
        removeGoogleAnalytics();
    }
    
    hideCookieSettings();
    hideCookieBanner();
}

// =============== GOOGLE ANALYTICS ===============
function loadGoogleAnalytics(force = false) {
    console.log('🔄 Chargement de Google Analytics...');
    
    // Vérifier consentement
    const consent = getCookie('cookieConsent');
    const analytics = getCookie('analyticsCookies');
    
    if (!force && (!consent || !(consent === 'all' || (consent === 'custom' && analytics === 'true')))) {
        console.log('⛔ Pas de consentement pour GA');
        return;
    }
    
    // Déjà chargé ?
    if (window.gtag && !force) {
        console.log('✅ GA déjà chargé');
        sendPageView();
        return;
    }
    
    // Charger le script GA
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-NJLCB6G0G8';
    script.onload = initGtag;
    script.onerror = () => console.error('❌ Erreur chargement GA');
    document.head.appendChild(script);
}

function initGtag() {
    console.log('✅ Script GA chargé, initialisation...');
    
    // Initialiser dataLayer et gtag
    window.dataLayer = window.dataLayer || [];
    
    // Définir la fonction gtag
    window.gtag = function() {
        dataLayer.push(arguments);
    };
    
    // Configuration de base
    gtag('js', new Date());
    
    // Configuration avec options
    gtag('config', 'G-NJLCB6G0G8', {
        'page_title': getPageTitle(),
        'page_location': window.location.href,
        'page_path': window.location.pathname,
        'device_type': deviceType,
        'anonymize_ip': true,
        'allow_google_signals': false,
        'allow_ad_personalization_signals': false
    });
    
    // Envoyer page_view
    sendPageView();
    
    // Initialiser le tracking
    initTracking();
    
    console.log('🎯 Google Analytics initialisé avec succès');
    isGALoaded = true;
}

function sendPageView() {
    if (typeof gtag === 'undefined' || pageViewSent) return;
    
    gtag('event', 'page_view', {
        'page_title': getPageTitle(),
        'page_location': window.location.href,
        'page_path': window.location.pathname,
        'page_category': getPageCategory(),
        'device_type': deviceType
    });
    
    pageViewSent = true;
    console.log('📤 Page View envoyée:', getPageTitle());
}

function removeGoogleAnalytics() {
    const script = document.querySelector('script[src*="googletagmanager.com/gtag/js"]');
    if (script) script.remove();
    window.dataLayer = [];
    delete window.gtag;
    isGALoaded = false;
    console.log('🗑️ GA supprimé');
}

// =============== TRACKING DES ÉVÉNEMENTS ===============
function initTracking() {
    console.log('🎯 Initialisation du tracking...');
    
    // Tracking des clics
    document.addEventListener('click', trackClick, true);
    
    // Tracking des formulaires
    document.addEventListener('submit', trackFormSubmit, true);
    
    // Tracking du scroll
    initScrollTracking();
}

function trackClick(e) {
    if (typeof gtag === 'undefined') return;
    
    const target = e.target.closest('a, button, [role="button"], .btn');
    if (!target) return;
    
    // Attendre le prochain tick
    setTimeout(() => {
        const text = getElementText(target);
        const category = getElementCategory(target);
        
        gtag('event', 'click', {
            'event_category': category,
            'event_label': text,
            'element_type': target.tagName.toLowerCase(),
            'page_title': getPageTitle(),
            'device_type': deviceType
        });
        
        console.log('🖱️ Clic tracké:', text);
    }, 50);
}

function trackFormSubmit(e) {
    if (typeof gtag === 'undefined') return;
    
    const form = e.target;
    setTimeout(() => {
        gtag('event', 'form_submit', {
            'event_category': 'Form',
            'event_label': form.id || 'form',
            'form_id': form.id || 'unknown',
            'page_title': getPageTitle()
        });
        console.log('📝 Formulaire soumis:', form.id);
    }, 100);
}

function initScrollTracking() {
    let scrollTracked = { 25: false, 50: false, 75: false, 90: false };
    
    const trackScroll = () => {
        if (typeof gtag === 'undefined') return;
        
        const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
        
        Object.keys(scrollTracked).forEach(threshold => {
            if (!scrollTracked[threshold] && scrollPercent >= parseInt(threshold)) {
                gtag('event', 'scroll', {
                    'event_category': 'Engagement',
                    'event_label': `Scroll ${threshold}%`,
                    'scroll_depth': threshold,
                    'page_title': getPageTitle()
                });
                scrollTracked[threshold] = true;
                console.log('📜 Scroll tracké:', threshold + '%');
            }
        });
    };
    
    window.addEventListener('scroll', trackScroll, { passive: true });
}

// =============== UTILITAIRES ===============
function getElementText(element) {
    return element.textContent?.trim()?.substring(0, 100) || 
           element.getAttribute('aria-label') || 
           element.title || 
           element.value || 
           element.placeholder || 
           element.tagName.toLowerCase();
}

function getElementCategory(element) {
    const section = element.closest('section, header, footer, nav');
    if (!section) return 'General';
    
    if (section.classList.contains('hero')) return 'Hero';
    if (section.classList.contains('cta')) return 'CTA';
    if (section.tagName === 'HEADER') return 'Header';
    if (section.tagName === 'FOOTER') return 'Footer';
    return 'Content';
}

// =============== INITIALISATION ===============
function initAll() {
    console.log('🚀 Initialisation analytics...');
    
    // Détecter le device
    deviceType = detectDeviceType();
    console.log('📱 Device:', deviceType);
    
    // Attacher les événements cookies
    attachCookieEvents();
    
    // Vérifier consentement et charger GA si besoin
    const consent = getCookie('cookieConsent');
    const analytics = getCookie('analyticsCookies');
    
    if (consent && (consent === 'all' || (consent === 'custom' && analytics === 'true'))) {
        console.log('✅ Consentement trouvé, chargement GA...');
        setTimeout(() => loadGoogleAnalytics(), 300);
    } else if (!consent) {
        console.log('🔄 Aucun consentement, affichage bannière...');
        setTimeout(showCookieBanner, 1500);
    }
    
    // Mise à jour du device si redimensionnement
    window.addEventListener('resize', () => {
        const newType = detectDeviceType();
        if (newType !== deviceType) {
            deviceType = newType;
            console.log('🔄 Changement device:', deviceType);
            if (typeof gtag !== 'undefined') {
                gtag('event', 'device_change', {
                    'device_type': deviceType,
                    'screen_width': window.innerWidth
                });
            }
        }
    });
}

function attachCookieEvents() {
    // Utiliser la délégation d'événements
    document.addEventListener('click', (e) => {
        const target = e.target.closest('[class*="cookie"], [class*="modal"]');
        if (!target) return;
        
        const classList = target.className;
        
        if (classList.includes('accept')) acceptCookies();
        else if (classList.includes('reject')) rejectCookies();
        else if (classList.includes('settings')) showCookieSettings();
        else if (classList.includes('close-modal')) hideCookieSettings();
        else if (classList.includes('save')) saveCookiePreferences();
        else if (classList.includes('cancel')) hideCookieSettings();
    });
}

// =============== DÉMARRAGE ===============
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else {
    initAll();
}

// Pour debug dans la console
window.debugGA = {
    check: () => {
        console.log('🔍 Debug GA:');
        console.log('- gtag exists:', typeof gtag !== 'undefined');
        console.log('- dataLayer:', window.dataLayer?.length || 0, 'items');
        console.log('- Page:', getPageTitle());
        console.log('- Device:', deviceType);
        console.log('- Consent:', getCookie('cookieConsent'));
    },
    testEvent: () => {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'debug_test', {
                'test': 'ok',
                'time': Date.now()
            });
            console.log('✅ Événement test envoyé');
        } else {
            console.log('❌ gtag non disponible');
        }
    },
    reload: () => {
        loadGoogleAnalytics(true);
    }
};

console.log('📊 Analytics Manager prêt');
