// =============== ANALYTICS & COOKIES MANAGER ===============
// Compatible PC/Mobile/Tablette - Toutes les pages
// Version: 1.0.0

// VARIABLES GLOBALES
let isGALoaded = false;
let pendingEvents = [];
let pageViewSent = false;
let deviceType = 'desktop';

// DÉTECTION DU TYPE D'APPAREIL
function detectDeviceType() {
    const width = window.innerWidth;
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Détection par taille d'écran ET user agent
    if (width < 768 || /android|webos|iphone|ipad|ipod|blackberry|windows phone/.test(userAgent)) {
        return width < 480 ? 'mobile' : 'tablet';
    }
    return 'desktop';
}

// =============== MAPPING DES PAGES ===============
function getPageTitle() {
    const path = window.location.pathname;
    const fullPath = window.location.pathname + window.location.search;
    
    // Mapping complet basé sur votre sitemap
    const pageMapping = {
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
    
    // Chercher d'abord le chemin exact, puis avec des patterns
    if (pageMapping[path]) {
        return pageMapping[path];
    }
    
    // Chercher par pattern (au cas où)
    for (const [key, value] of Object.entries(pageMapping)) {
        if (path.includes(key.replace('.html', ''))) {
            return value;
        }
    }
    
    // Fallback
    return document.title || 'UNWARE STUDIO';
}

function getPageCategory() {
    const path = window.location.pathname.toLowerCase();
    
    if (path === '/' || path.includes('index')) return 'Accueil';
    if (path.includes('nexa/')) return 'NEXA';
    if (path.includes('create-account') || path.includes('login')) return 'Compte';
    if (path.includes('support/')) return 'Support';
    if (path.includes('legals/')) return 'Légal';
    
    return 'Autre';
}

function getPagePath() {
    return window.location.pathname;
}

// =============== GESTION DES COOKIES ===============
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    const secure = window.location.protocol === 'https:' ? 'Secure' : '';
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax;${secure}`;
    console.log(`🍪 Cookie défini: ${name}=${value}`);
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}

function deleteCookie(name) {
    setCookie(name, '', -1);
}

// =============== UI COOKIES ===============
function showCookieBanner() {
    const banner = document.getElementById('custom-cookie-banner');
    if (banner) {
        banner.classList.remove('hiding');
        banner.classList.add('show');
        console.log('📢 Bannière cookies affichée');
    }
}

function hideCookieBanner() {
    const banner = document.getElementById('custom-cookie-banner');
    if (banner) {
        banner.classList.add('hiding');
        setTimeout(() => {
            banner.classList.remove('show');
            banner.classList.remove('hiding');
        }, 400);
    }
}

function showCookieSettings() {
    const modal = document.getElementById('cookieModal');
    if (modal) {
        modal.classList.add('show');
        
        // Remplir les cases avec les valeurs actuelles
        const analytics = getCookie('analyticsCookies');
        const performance = getCookie('performanceCookies');
        
        const analyticsCheckbox = document.getElementById('analyticsCookies');
        const performanceCheckbox = document.getElementById('performanceCookies');
        
        if (analyticsCheckbox) {
            analyticsCheckbox.checked = analytics === 'true';
        }
        if (performanceCheckbox) {
            performanceCheckbox.checked = performance === 'true';
        }
        
        hideCookieBanner();
    }
}

function hideCookieSettings() {
    const modal = document.getElementById('cookieModal');
    if (modal) {
        modal.classList.remove('show');
    }
    if (!getCookie('cookieConsent')) {
        setTimeout(showCookieBanner, 500);
    }
}

function acceptCookies() {
    console.log('✅ Cookies acceptés');
    setCookie('cookieConsent', 'all', 365);
    setCookie('analyticsCookies', 'true', 365);
    setCookie('performanceCookies', 'true', 365);
    
    // Recharger GA
    setTimeout(() => {
        loadGoogleAnalytics();
    }, 100);
    
    hideCookieBanner();
    
    // Tracking de l'acceptation
    if (typeof gtag !== 'undefined') {
        gtag('event', 'cookie_accept', {
            'event_category': 'Cookies',
            'event_label': 'Accepté tous'
        });
    }
}

function rejectCookies() {
    console.log('❌ Cookies refusés');
    setCookie('cookieConsent', 'necessary', 365);
    setCookie('analyticsCookies', 'false', 365);
    setCookie('performanceCookies', 'false', 365);
    hideCookieBanner();
    
    // Tracking du refus
    if (typeof gtag !== 'undefined') {
        gtag('event', 'cookie_reject', {
            'event_category': 'Cookies',
            'event_label': 'Refusé'
        });
    }
}

function saveCookiePreferences() {
    console.log('⚙️ Préférences cookies sauvegardées');
    
    const analyticsChecked = document.getElementById('analyticsCookies').checked;
    const performanceChecked = document.getElementById('performanceCookies').checked;
    
    setCookie('cookieConsent', 'custom', 365);
    setCookie('analyticsCookies', analyticsChecked ? 'true' : 'false', 365);
    setCookie('performanceCookies', performanceChecked ? 'true' : 'false', 365);
    
    if (analyticsChecked) {
        setTimeout(() => {
            loadGoogleAnalytics();
        }, 100);
    } else {
        // Supprimer GA si désactivé
        removeGoogleAnalytics();
    }
    
    hideCookieSettings();
    hideCookieBanner();
    
    // Tracking des préférences
    if (typeof gtag !== 'undefined') {
        gtag('event', 'cookie_customize', {
            'event_category': 'Cookies',
            'event_label': `Analytics: ${analyticsChecked}, Performance: ${performanceChecked}`
        });
    }
}

// =============== GOOGLE ANALYTICS ===============
function safeGtag(eventName, eventParams) {
    if (typeof gtag !== 'undefined' && window.dataLayer) {
        gtag('event', eventName, eventParams);
        console.log(`📊 [${deviceType.toUpperCase()}] Événement: ${eventName}`, eventParams);
        return true;
    } else {
        console.log(`⏳ [${deviceType.toUpperCase()}] GA pas prêt, événement en attente: ${eventName}`);
        pendingEvents.push({ eventName, eventParams });
        return false;
    }
}

function flushPendingEvents() {
    if (pendingEvents.length > 0 && typeof gtag !== 'undefined') {
        console.log(`🔄 [${deviceType.toUpperCase()}] Envoi ${pendingEvents.length} événements en attente...`);
        const eventsToProcess = [...pendingEvents];
        pendingEvents = [];
        
        eventsToProcess.forEach(event => {
            try {
                gtag('event', event.eventName, event.eventParams);
            } catch (e) {
                console.error('Erreur envoi événement:', e);
            }
        });
    }
}

function loadGoogleAnalytics() {
    console.log(`🔍 [${deviceType.toUpperCase()}] Chargement Google Analytics...`);
    
    // Vérifier si déjà chargé
    if (window.dataLayer && typeof gtag !== 'undefined') {
        console.log(`✅ [${deviceType.toUpperCase()}] GA déjà chargé, envoi page_view`);
        sendPageView();
        flushPendingEvents();
        initAdvancedTracking();
        isGALoaded = true;
        return;
    }
    
    // Vérifier le consentement
    const consent = getCookie('cookieConsent');
    const analytics = getCookie('analyticsCookies');
    
    if (!consent || !(consent === 'all' || (consent === 'custom' && analytics === 'true'))) {
        console.log(`⛔ [${deviceType.toUpperCase()}] Pas de consentement pour GA`);
        return;
    }
    
    // Créer le script GA
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-NJLCB6G0G8';
    script.id = 'ga-script';
    
    script.onload = function() {
        console.log(`🎯 [${deviceType.toUpperCase()}] Google Analytics chargé`);
        
        // Initialiser dataLayer
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        
        // Configuration de base
        gtag('config', 'G-NJLCB6G0G8', {
            'anonymize_ip': true,
            'allow_google_signals': false,
            'allow_ad_personalization_signals': false,
            'page_title': getPageTitle(),
            'page_location': window.location.href,
            'page_path': getPagePath(),
            'page_category': getPageCategory(),
            'device_type': deviceType,
            'send_page_view': false // On gère manuellement
        });
        
        // Envoyer la page view
        sendPageView();
        
        // Traiter les événements en attente
        flushPendingEvents();
        
        // Initialiser le tracking avancé
        initAdvancedTracking();
        
        isGALoaded = true;
        
        // Tracking du chargement GA
        gtag('event', 'ga_loaded', {
            'event_category': 'Analytics',
            'event_label': deviceType,
            'page_title': getPageTitle()
        });
    };
    
    script.onerror = function() {
        console.error(`❌ [${deviceType.toUpperCase()}] Erreur chargement GA`);
        isGALoaded = false;
    };
    
    document.head.appendChild(script);
}

function removeGoogleAnalytics() {
    // Supprimer le script GA
    const script = document.getElementById('ga-script');
    if (script) {
        script.remove();
    }
    
    // Réinitialiser les variables
    window.dataLayer = [];
    isGALoaded = false;
    console.log(`🗑️ [${deviceType.toUpperCase()}] GA supprimé`);
}

function sendPageView() {
    if (typeof gtag !== 'undefined' && !pageViewSent) {
        const pageInfo = {
            'page_title': getPageTitle(),
            'page_location': window.location.href,
            'page_path': getPagePath(),
            'page_category': getPageCategory(),
            'device_type': deviceType,
            'user_agent': navigator.userAgent.substring(0, 100)
        };
        
        gtag('event', 'page_view', pageInfo);
        pageViewSent = true;
        
        console.log(`📤 [${deviceType.toUpperCase()}] Page View envoyée:`, getPageTitle());
        
        // Tracking supplémentaire pour le device
        gtag('event', 'device_detected', {
            'event_category': 'System',
            'event_label': deviceType,
            'screen_width': window.innerWidth,
            'screen_height': window.innerHeight
        });
    }
}

// =============== TRACKING AVANCÉ ===============
function initAdvancedTracking() {
    console.log(`🚀 [${deviceType.toUpperCase()}] Initialisation tracking avancé`);
    
    // Tracking des clics (tous les appareils)
    document.addEventListener('click', function(e) {
        trackClickEvent(e);
    }, { passive: true });
    
    // Tracking des erreurs
    window.addEventListener('error', function(e) {
        trackErrorEvent(e);
    });
    
    // Tracking du temps sur page
    initTimeTracking();
    
    // Tracking du scroll (sauf mobile si trop lent)
    if (deviceType !== 'mobile' || window.innerWidth > 375) {
        initScrollTracking();
    }
    
    // Tracking des formulaires
    initFormTracking();
}

function trackClickEvent(e) {
    const target = e.target;
    const interactiveEl = target.closest('a, button, .btn, [role="button"], input[type="submit"], input[type="button"]');
    
    if (!interactiveEl) return;
    
    // Vérifier consentement
    const consent = getCookie('cookieConsent');
    const analytics = getCookie('analyticsCookies');
    if (!consent || !(consent === 'all' || (consent === 'custom' && analytics === 'true'))) return;
    
    setTimeout(() => {
        const elementInfo = getClickElementInfo(interactiveEl);
        
        const eventData = {
            'event_category': elementInfo.category,
            'event_label': elementInfo.label,
            'element_type': elementInfo.type,
            'element_text': elementInfo.text.substring(0, 100),
            'page_title': getPageTitle(),
            'device_type': deviceType,
            'interaction_type': e.type
        };
        
        // Différencier les types d'événements
        let eventName = 'user_click';
        if (elementInfo.type === 'navigation') eventName = 'navigation_click';
        if (elementInfo.type === 'social') eventName = 'social_click';
        if (elementInfo.type === 'form') eventName = 'form_interaction';
        if (interactiveEl.classList.contains('cookie-btn')) eventName = 'cookie_interaction';
        
        safeGtag(eventName, eventData);
    }, 50);
}

function getClickElementInfo(element) {
    const text = element.textContent?.trim() || 
                 element.getAttribute('aria-label') || 
                 element.title || 
                 element.alt || 
                 element.value || 
                 element.placeholder || 
                 element.tagName.toLowerCase();
    
    let type = 'interactive';
    if (element.tagName === 'A') {
        const href = element.getAttribute('href') || '';
        if (href.includes('discord') || href.includes('twitter') || href.includes('youtube') || href.includes('instagram')) {
            type = 'social';
        } else if (href && !href.startsWith('#') && !href.startsWith('javascript')) {
            type = 'navigation';
        } else {
            type = 'link';
        }
    } else if (element.tagName === 'BUTTON') {
        type = 'button';
    } else if (element.type === 'submit') {
        type = 'form';
    } else if (element.classList.contains('social-link')) {
        type = 'social';
    }
    
    const category = getElementCategory(element);
    
    return {
        text: text,
        type: type,
        category: category,
        label: `${text} - ${category}`
    };
}

function getElementCategory(element) {
    const section = element.closest('section, header, footer, nav, main, article, aside');
    if (!section) return 'General';
    
    if (section.classList.contains('hero')) return 'Hero';
    if (section.classList.contains('cta')) return 'CTA';
    if (section.id === 'accueil') return 'Accueil';
    if (section.id === 'telecharger') return 'Téléchargement';
    if (section.tagName === 'HEADER') return 'Header';
    if (section.tagName === 'FOOTER') return 'Footer';
    if (section.tagName === 'NAV') return 'Navigation';
    if (section.tagName === 'MAIN') return 'Main Content';
    
    return section.id || section.className || 'Content';
}

function initTimeTracking() {
    let startTime = Date.now();
    let maxTime = 0;
    
    window.addEventListener('beforeunload', function() {
        const consent = getCookie('cookieConsent');
        const analytics = getCookie('analyticsCookies');
        if (!consent || !(consent === 'all' || (consent === 'custom' && analytics === 'true'))) return;
        
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        maxTime = Math.max(maxTime, timeSpent);
        
        if (maxTime > 3) { // Minimum 3 secondes
            safeGtag('time_spent', {
                'event_category': 'Engagement',
                'event_label': 'Temps sur la page',
                'time_seconds': maxTime,
                'page_title': getPageTitle(),
                'device_type': deviceType
            });
        }
    });
}

function initScrollTracking() {
    let scrollStates = { 25: false, 50: false, 75: false, 90: false };
    
    const trackScroll = function() {
        const consent = getCookie('cookieConsent');
        const analytics = getCookie('analyticsCookies');
        if (!consent || !(consent === 'all' || (consent === 'custom' && analytics === 'true'))) return;
        
        const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
        
        Object.keys(scrollStates).forEach(threshold => {
            if (!scrollStates[threshold] && scrollPercent >= parseInt(threshold)) {
                safeGtag('scroll_depth', {
                    'event_category': 'Engagement',
                    'event_label': `Scroll ${threshold}%`,
                    'scroll_percentage': threshold,
                    'page_title': getPageTitle(),
                    'device_type': deviceType
                });
                scrollStates[threshold] = true;
            }
        });
    };
    
    // Démarrer après un délai
    setTimeout(() => {
        if (typeof gtag !== 'undefined') {
            window.addEventListener('scroll', trackScroll, { passive: true });
        }
    }, 1000);
}

function initFormTracking() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const consent = getCookie('cookieConsent');
            const analytics = getCookie('analyticsCookies');
            if (!consent || !(consent === 'all' || (consent === 'custom' && analytics === 'true'))) return;
            
            setTimeout(() => {
                safeGtag('form_submit', {
                    'event_category': 'Form',
                    'event_label': form.id || 'form_soumis',
                    'form_id': form.id || 'unknown',
                    'form_action': form.action || 'unknown',
                    'page_title': getPageTitle(),
                    'device_type': deviceType
                });
            }, 100);
        });
    });
}

function trackErrorEvent(e) {
    const consent = getCookie('cookieConsent');
    const analytics = getCookie('analyticsCookies');
    if (!consent || !(consent === 'all' || (consent === 'custom' && analytics === 'true'))) return;
    
    safeGtag('js_error', {
        'event_category': 'Error',
        'event_label': e.message?.substring(0, 200) || 'Unknown error',
        'error_message': e.message?.substring(0, 500) || 'No message',
        'error_file': e.filename || 'Unknown',
        'error_line': e.lineno || 'Unknown',
        'error_column': e.colno || 'Unknown',
        'page_title': getPageTitle(),
        'device_type': deviceType
    });
}

// =============== INITIALISATION ===============
function initAnalytics() {
    console.log(`🌐 Initialisation analytics sur ${getPageTitle()}`);
    
    // Détecter le device
    deviceType = detectDeviceType();
    console.log(`📱 Device détecté: ${deviceType}`);
    
    // Attacher les événements UI
    attachCookieEvents();
    attachMobileEvents();
    
    // Vérifier les cookies existants
    const consent = getCookie('cookieConsent');
    const analytics = getCookie('analyticsCookies');
    
    if (consent && (consent === 'all' || (consent === 'custom' && analytics === 'true'))) {
        console.log(`✅ Consentement trouvé: ${consent}`);
        
        // Petit délai pour stabilité
        setTimeout(() => {
            loadGoogleAnalytics();
        }, 300);
    } else if (!consent) {
        console.log('🔄 Aucun consentement, attente');
        
        // Afficher la bannière après un délai (sauf mobile pour éviter le popup immédiat)
        const delay = deviceType === 'mobile' ? 2000 : 1500;
        setTimeout(showCookieBanner, delay);
    } else {
        console.log(`⛔ Consentement mais analytics désactivé: ${analytics}`);
    }
    
    // Rafraîchir le tracking si redimensionnement
    window.addEventListener('resize', function() {
        const newDeviceType = detectDeviceType();
        if (newDeviceType !== deviceType) {
            console.log(`🔄 Changement de device: ${deviceType} → ${newDeviceType}`);
            deviceType = newDeviceType;
            
            // Re-envoyer page view avec nouveau device
            if (typeof gtag !== 'undefined' && pageViewSent) {
                pageViewSent = false;
                sendPageView();
            }
        }
    });
}

function attachCookieEvents() {
    // Boutons bannière
    document.addEventListener('click', function(e) {
        if (e.target.matches('.cookie-btn.accept, .cookie-btn.accept *')) {
            e.preventDefault();
            acceptCookies();
        }
        if (e.target.matches('.cookie-btn.reject, .cookie-btn.reject *')) {
            e.preventDefault();
            rejectCookies();
        }
        if (e.target.matches('.cookie-btn.settings, .cookie-btn.settings *')) {
            e.preventDefault();
            showCookieSettings();
        }
        if (e.target.matches('.close-modal, .close-modal *')) {
            e.preventDefault();
            hideCookieSettings();
        }
        if (e.target.matches('.modal-btn.save, .modal-btn.save *')) {
            e.preventDefault();
            saveCookiePreferences();
        }
        if (e.target.matches('.modal-btn.cancel, .modal-btn.cancel *')) {
            e.preventDefault();
            hideCookieSettings();
        }
    });
}

function attachMobileEvents() {
    // Menu mobile (si présent)
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileClose = document.getElementById('mobileClose');
    const overlay = document.getElementById('overlay');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            safeGtag('mobile_menu_open', {
                'event_category': 'Mobile',
                'event_label': 'Menu ouvert',
                'device_type': deviceType
            });
        });
    }
    
    if (mobileClose) {
        mobileClose.addEventListener('click', function() {
            safeGtag('mobile_menu_close', {
                'event_category': 'Mobile',
                'event_label': 'Menu fermé',
                'device_type': deviceType
            });
        });
    }
    
    if (overlay) {
        overlay.addEventListener('click', function() {
            safeGtag('mobile_overlay_click', {
                'event_category': 'Mobile',
                'event_label': 'Overlay cliqué',
                'device_type': deviceType
            });
        });
    }
}

// =============== DÉMARRAGE ===============
// Démarrer quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnalytics);
} else {
    initAnalytics();
}

// Exposer certaines fonctions globalement (pour debug)
window.NEXAAnalytics = {
    getPageTitle: getPageTitle,
    getDeviceType: () => deviceType,
    getConsentStatus: () => getCookie('cookieConsent'),
    flushEvents: flushPendingEvents,
    sendTestEvent: () => safeGtag('test_event', { test: true })
};

console.log('📊 Analytics Manager chargé');
