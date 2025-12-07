// =============== GOOGLE ANALYTICS 4 - Version avec API sécurisée ===============
const GA_MEASUREMENT_ID = 'G-NJLCB6G0G8';
let isGALoaded = false;
let deviceType = 'desktop';
let clientId = null;
let cookiesRejected = false;

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
    // Vérifier explicitement si les cookies sont refusés
    if (consent === 'rejected') {
        cookiesRejected = true;
        return false;
    }
    
    const analytics = getCookie('analyticsCookies');
    return consent && (consent === 'all' || (consent === 'custom' && analytics === 'true'));
}

// =============== VÉRIFICATION COOKIES REFUSÉS ===============
function areCookiesRejected() {
    const consent = getCookie('cookieConsent');
    cookiesRejected = consent === 'rejected';
    return cookiesRejected;
}

// =============== API SÉCURISÉE VERCEL ===============
async function sendToSecureAPI(eventName, params = {}) {
    // NE RIEN ENVOYER si cookies refusés
    if (areCookiesRejected() || cookiesRejected) {
        console.log('⛔ Cookies refusés - Pas d\'envoi API');
        return false;
    }
    
    // Vérifier le consentement normal
    if (!shouldLoadGA()) {
        console.log('⛔ Pas de consentement pour l\'API');
        return false;
    }
    
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
    // NE RIEN FAIRE si cookies refusés
    if (areCookiesRejected()) {
        console.log('⛔ Cookies refusés - GA non initialisé');
        return;
    }
    
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
    // NE RIEN TRACKER si cookies refusés
    if (areCookiesRejected()) {
        console.log('⛔ Cookies refusés - Pas de tracking');
        return;
    }
    
    console.log('🎯 Activation tracking...');
    
    // Clics
    document.addEventListener('click', function(e) {
        // Vérifier avant chaque clic
        if (areCookiesRejected()) return;
        
        setTimeout(() => {
            trackClick(e.target);
            trackClickSecure(e.target);
        }, 50);
    }, { passive: true });
    
    // Formulaires
    document.addEventListener('submit', function(e) {
        // Vérifier avant chaque soumission
        if (areCookiesRejected()) return;
        
        trackFormSubmit(e.target);
        trackFormSubmitSecure(e.target);
    });
}

// Tracking standard
function trackClick(element) {
    // Vérifier si cookies refusés
    if (areCookiesRejected() || !window.gtag || !element) return;
    
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
    // Vérifier si cookies refusés
    if (areCookiesRejected()) return;
    
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
    if (areCookiesRejected() || !window.gtag) return;
    
    gtag('event', 'form_submit', {
        'event_category': 'form',
        'event_label': form.id || 'form_submit',
        'form_id': form.id || 'unknown',
        'page_title': getPageTitle()
    });
}

function trackFormSubmitSecure(form) {
    if (areCookiesRejected()) return;
    
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
        
        // Acceptation des cookies
        if (target.closest('.cookie-btn.accept')) {
            setTimeout(() => initializeGoogleAnalytics(), 100);
        }
        
        // Refus des cookies
        if (target.closest('.cookie-btn.reject')) {
            cookiesRejected = true;
            console.log('⛔ Cookies refusés - Désactivation GA');
        }
        
        // Enregistrement des préférences
        if (target.closest('.modal-btn.save')) {
            const analyticsChecked = document.getElementById('analyticsCookies')?.checked;
            if (analyticsChecked) {
                setTimeout(() => initializeGoogleAnalytics(), 100);
            }
        }
    });
}

// =============== BANNIÈRE COOKIES ===============
function showCookieBanner() {
    const banner = document.getElementById('custom-cookie-banner');
    const consent = getCookie('cookieConsent');
    
    // NE PAS AFFICHER si :
    // 1. Les cookies ont déjà été refusés
    // 2. Un consentement existe déjà
    if (consent === 'rejected' || consent) {
        return;
    }
    
    if (banner) {
        banner.style.display = 'block';
        setTimeout(() => banner.classList.add('show'), 10);
    }
}

function hideCookieBanner() {
    const banner = document.getElementById('custom-cookie-banner');
    if (banner) {
        banner.classList.remove('show');
        setTimeout(() => {
            banner.style.display = 'none';
        }, 400);
    }
}

// =============== INITIALISATION PRINCIPALE ===============
function initAnalytics() {
    console.log('🌐 Initialisation analytics...');
    
    // Détecter device
    deviceType = detectDeviceType();
    console.log('📱 Device:', deviceType);
    
    // Vérifier immédiatement si cookies refusés
    if (areCookiesRejected()) {
        console.log('⛔ Cookies refusés - Analytics désactivé');
        // Désactiver toutes les fonctions de tracking
        isGALoaded = false;
        return;
    }
    
    // Attacher événements cookies
    attachCookieEvents();
    
    // Vérifier consentement
    if (shouldLoadGA()) {
        console.log('✅ Consentement OK, chargement GA...');
        setTimeout(() => initializeGoogleAnalytics(), 300);
    } else {
        console.log('🔄 En attente consentement...');
        // Afficher bannière seulement si pas déjà refusé
        if (!areCookiesRejected()) {
            setTimeout(showCookieBanner, 1500);
        }
    }
}

// =============== DÉMARRAGE ===============
document.addEventListener('DOMContentLoaded', initAnalytics);

// =============== FONCTIONS COOKIES POUR LA BANNIÈRE ===============
// Ces fonctions doivent être disponibles globalement pour la bannière
function acceptCookies() {
    setCookie('cookieConsent', 'all', 365);
    setCookie('analyticsCookies', 'true', 365);
    setCookie('performanceCookies', 'true', 365);
    hideCookieBanner();
    setTimeout(() => initializeGoogleAnalytics(), 100);
}

function rejectCookies() {
    setCookie('cookieConsent', 'rejected', 365);
    setCookie('analyticsCookies', 'false', 365);
    setCookie('performanceCookies', 'false', 365);
    cookiesRejected = true;
    hideCookieBanner();
    console.log('⛔ Cookies refusés - Analytics désactivé');
}

function saveCookiePreferences() {
    const analyticsChecked = document.getElementById('analyticsCookies')?.checked;
    const performanceChecked = document.getElementById('performanceCookies')?.checked;
    
    setCookie('cookieConsent', 'custom', 365);
    setCookie('analyticsCookies', analyticsChecked ? 'true' : 'false', 365);
    setCookie('performanceCookies', performanceChecked ? 'true' : 'false', 365);
    
    if (analyticsChecked) {
        setTimeout(() => initializeGoogleAnalytics(), 100);
    }
    
    hideCookieSettings();
    hideCookieBanner();
}

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax;Secure";
}

// =============== DEBUG ===============
window.debugGA = {
    check: function() {
        console.log('🔍 État GA:');
        console.log('- Cookies refusés:', areCookiesRejected());
        console.log('- gtag exists:', typeof gtag !== 'undefined');
        console.log('- GA Loaded:', isGALoaded);
        console.log('- Page:', getPageTitle());
        console.log('- Device:', deviceType);
        console.log('- Client ID:', getClientId());
        console.log('- Consent:', getCookie('cookieConsent'));
        console.log('- Analytics cookies:', getCookie('analyticsCookies'));
    },
    
    test: function() {
        // Vérifier si cookies refusés
        if (areCookiesRejected()) {
            console.log('⛔ Cookies refusés - Test impossible');
            return;
        }
        
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
        if (areCookiesRejected()) {
            console.log('⛔ Impossible de forcer GA - Cookies refusés');
            return;
        }
        initializeGoogleAnalytics();
    },
    
    apiTest: function() {
        if (areCookiesRejected()) {
            console.log('⛔ Impossible de tester API - Cookies refusés');
            return Promise.resolve(false);
        }
        return sendToSecureAPI('api_test', { test: 'direct' });
    },
    
    reset: function() {
        // Supprimer tous les cookies de consentement
        document.cookie.split(";").forEach(function(c) {
            if (c.includes('cookieConsent') || c.includes('analyticsCookies') || c.includes('performanceCookies')) {
                const name = c.split("=")[0].trim();
                document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            }
        });
        cookiesRejected = false;
        console.log('🔄 Cookies réinitialisés');
        location.reload();
    }
};

console.log('📊 Analytics Manager prêt - Détection refus cookies activée');
