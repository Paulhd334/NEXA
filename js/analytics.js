// js/analytics.js
// =============== ANALYTICS & COOKIES MANAGER ===============

// VARIABLE GLOBALE
let isGALoaded = false;
let pendingEvents = [];

// NOMS DES PAGES
function getPageTitle() {
    const path = window.location.pathname;
    
    const pageNames = {
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
    
    return pageNames[path] || document.title;
}

function getPageCategory() {
    const path = window.location.pathname;
    if (path === '/' || path === '/index.html') return 'Accueil';
    if (path.includes('/nexa/')) return 'NEXA';
    if (path.includes('/Support/')) return 'Support';
    if (path.includes('/legals/')) return 'Légal';
    if (path.includes('create-account') || path.includes('login')) return 'Compte';
    return 'Autre';
}

// =============== GESTION DES COOKIES ===============
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax;Secure";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// =============== FONCTIONS COOKIES ===============
function showCookieBanner() {
    const banner = document.getElementById('custom-cookie-banner');
    if (banner) {
        banner.classList.remove('hiding');
        banner.classList.add('show');
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
        const analytics = getCookie('analyticsCookies');
        const performance = getCookie('performanceCookies');
        
        if (document.getElementById('analyticsCookies')) {
            document.getElementById('analyticsCookies').checked = analytics === 'true';
        }
        if (document.getElementById('performanceCookies')) {
            document.getElementById('performanceCookies').checked = performance === 'true';
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
    setCookie('cookieConsent', 'all', 365);
    setCookie('analyticsCookies', 'true', 365);
    setCookie('performanceCookies', 'true', 365);
    setTimeout(() => loadGoogleAnalytics(), 100);
    hideCookieBanner();
}

function rejectCookies() {
    setCookie('cookieConsent', 'necessary', 365);
    setCookie('analyticsCookies', 'false', 365);
    setCookie('performanceCookies', 'false', 365);
    hideCookieBanner();
}

function saveCookiePreferences() {
    const analyticsChecked = document.getElementById('analyticsCookies').checked;
    const performanceChecked = document.getElementById('performanceCookies').checked;
    
    setCookie('cookieConsent', 'custom', 365);
    setCookie('analyticsCookies', analyticsChecked ? 'true' : 'false', 365);
    setCookie('performanceCookies', performanceChecked ? 'true' : 'false', 365);
    
    if (analyticsChecked) {
        setTimeout(() => loadGoogleAnalytics(), 100);
    }
    
    hideCookieSettings();
    hideCookieBanner();
}

// =============== GOOGLE ANALYTICS ===============
function safeGtag(eventName, eventParams) {
    if (typeof gtag !== 'undefined' && window.dataLayer) {
        gtag('event', eventName, eventParams);
        console.log('📊 Événement envoyé:', eventName, eventParams);
        return true;
    } else {
        console.log('⏳ GA pas encore prêt, événement mis en file d\'attente:', eventName);
        pendingEvents.push({ eventName, eventParams });
        return false;
    }
}

function flushPendingEvents() {
    if (pendingEvents.length > 0) {
        console.log('🔄 Envoi des événements en attente...');
        const eventsToProcess = [...pendingEvents];
        pendingEvents = [];
        
        eventsToProcess.forEach(event => {
            if (typeof gtag !== 'undefined') {
                gtag('event', event.eventName, event.eventParams);
            }
        });
    }
}

function loadGoogleAnalytics() {
    console.log('🔍 Chargement de Google Analytics pour:', getPageTitle());
    
    // Si déjà chargé, juste envoyer page_view
    if (typeof gtag !== 'undefined' && window.dataLayer) {
        console.log('✅ GA déjà chargé, envoi page_view');
        sendPageView();
        flushPendingEvents();
        initAdvancedTracking();
        return;
    }
    
    // Charger GA
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-NJLCB6G0G8';
    
    script.onload = function() {
        console.log('🎯 Google Analytics chargé avec succès');
        
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        
        gtag('consent', 'default', {
            'analytics_storage': 'granted',
            'ad_storage': 'denied',
            'personalization_storage': 'denied',
            'functionality_storage': 'granted',
            'security_storage': 'granted'
        });
        
        gtag('config', 'G-NJLCB6G0G8', {
            'anonymize_ip': true,
            'allow_google_signals': false,
            'allow_ad_personalization_signals': false,
            'page_title': getPageTitle(),
            'page_location': window.location.href,
            'page_path': window.location.pathname,
            'send_page_view': false // On gère manuellement
        });
        
        // Envoyer page_view
        sendPageView();
        
        // Vider la file d'attente
        flushPendingEvents();
        
        // Initialiser le tracking avancé
        initAdvancedTracking();
    };
    
    script.onerror = function() {
        console.error('❌ Erreur lors du chargement de Google Analytics');
    };
    
    document.head.appendChild(script);
}

function sendPageView() {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            'page_title': getPageTitle(),
            'page_location': window.location.href,
            'page_path': window.location.pathname,
            'page_category': getPageCategory()
        });
        console.log('📤 page_view envoyé pour:', getPageTitle());
    }
}

// =============== TRACKING AVANCÉ ===============
function initAdvancedTracking() {
    console.log('🚀 Initialisation du tracking avancé...');
    
    // Tracking des clics
    document.addEventListener('click', function(e) {
        const target = e.target;
        const interactiveEl = target.closest('a, button, .btn, [role="button"], input[type="submit"]');
        
        if (!interactiveEl) return;

        const consent = getCookie('cookieConsent');
        const analytics = getCookie('analyticsCookies');
        if (!consent || !(consent === 'all' || (consent === 'custom' && analytics === 'true'))) return;

        setTimeout(() => trackUserAction(interactiveEl, 'click'), 50);
    });
    
    isGALoaded = true;
}

function trackUserAction(element, actionType) {
    const elementInfo = getElementInfo(element);
    
    const eventData = {
        'event_category': elementInfo.category,
        'event_label': `${elementInfo.text} - ${getPageTitle()}`,
        'element_type': elementInfo.type,
        'element_text': elementInfo.text,
        'page_title': getPageTitle()
    };

    safeGtag('user_click', eventData);
}

function getElementInfo(element) {
    return {
        text: getElementText(element),
        type: getElementType(element),
        category: getElementCategory(element)
    };
}

function getElementText(element) {
    if (element.textContent && element.textContent.trim()) {
        return element.textContent.trim().substring(0, 100);
    }
    if (element.getAttribute('aria-label')) return element.getAttribute('aria-label');
    if (element.title) return element.title;
    if (element.alt) return element.alt;
    if (element.value) return element.value;
    return element.tagName.toLowerCase();
}

function getElementType(element) {
    if (element.tagName === 'A') return 'link';
    if (element.tagName === 'BUTTON') return 'button';
    if (element.classList.contains('btn')) return 'button';
    return 'interactive';
}

function getElementCategory(element) {
    const section = element.closest('section, header, footer, nav, main');
    if (!section) return 'Unknown';
    
    if (section.classList.contains('hero')) return 'Hero';
    if (section.classList.contains('cta')) return 'CTA';
    if (section.tagName === 'HEADER') return 'Header';
    if (section.tagName === 'FOOTER') return 'Footer';
    return 'Content';
}

// =============== INITIALISATION ===============
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Page chargée:', getPageTitle());
    
    // Vérifier les cookies
    const consent = getCookie('cookieConsent');
    const analytics = getCookie('analyticsCookies');
    
    if (consent && (consent === 'all' || (consent === 'custom' && analytics === 'true'))) {
        console.log('✅ Consentement OK, chargement GA');
        loadGoogleAnalytics();
    }
    
    // Afficher bannière si pas de consentement
    if (!consent) {
        console.log('🔄 Aucun consentement, affichage bannière');
        setTimeout(showCookieBanner, 1000);
    }
    
    // Attacher les événements aux boutons cookies
    attachCookieEvents();
});

function attachCookieEvents() {
    // Boutons de la bannière
    const acceptBtn = document.querySelector('.cookie-btn.accept');
    const rejectBtn = document.querySelector('.cookie-btn.reject');
    const settingsBtn = document.querySelector('.cookie-btn.settings');
    
    if (acceptBtn) acceptBtn.addEventListener('click', acceptCookies);
    if (rejectBtn) rejectBtn.addEventListener('click', rejectCookies);
    if (settingsBtn) settingsBtn.addEventListener('click', showCookieSettings);
    
    // Boutons du modal
    const closeModal = document.querySelector('.close-modal');
    const saveBtn = document.querySelector('.modal-btn.save');
    const cancelBtn = document.querySelector('.modal-btn.cancel');
    
    if (closeModal) closeModal.addEventListener('click', hideCookieSettings);
    if (saveBtn) saveBtn.addEventListener('click', saveCookiePreferences);
    if (cancelBtn) cancelBtn.addEventListener('click', hideCookieSettings);
}
