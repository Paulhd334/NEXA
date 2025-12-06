
    // ============================================
    // FONCTIONS COOKIES SYNCHRONISÉES
    // ============================================

    // Fonction pour synchroniser les cookies entre les pages
    function syncCookiePreferences() {
        // Récupérer les préférences actuelles
        const analytics = getCookie('analyticsCookies');
        const performance = getCookie('performanceCookies');
        const consent = getCookie('cookieConsent');
        
        // Mettre à jour les cases à cocher si elles existent sur la page
        if (document.getElementById('analyticsCookies')) {
            document.getElementById('analyticsCookies').checked = analytics === 'true';
        }
        if (document.getElementById('performanceCookies')) {
            document.getElementById('performanceCookies').checked = performance === 'true';
        }
        
        console.log('🔄 Préférences synchronisées:', { consent, analytics, performance });
        return { consent, analytics, performance };
    }

    // Fonction pour afficher/masquer le bouton selon le consentement
    function updateManageCookieButton() {
        const consent = getCookie('cookieConsent');
        const manageBtn = document.getElementById('reopen-cookie-settings');
        
        if (manageBtn) {
            // Toujours afficher le bouton si un consentement a été fait
            if (consent) {
                manageBtn.style.display = 'flex';
            } else {
                manageBtn.style.display = 'none';
            }
        }
    }

    // Fonction pour réouvrir le menu de gestion
    function reopenCookieSettings() {
        showCookieSettings();
    }

    function showCookieBanner() {
        const banner = document.getElementById('custom-cookie-banner');
        const consent = getCookie('cookieConsent');
        
        // NE PAS afficher la bannière si un choix a déjà été fait
        if (consent) {
            return;
        }
        
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
            syncCookiePreferences();
            hideCookieBanner();
        }
    }

    function hideCookieSettings() {
        const modal = document.getElementById('cookieModal');
        if (modal) {
            modal.classList.remove('show');
        }
        const consent = getCookie('cookieConsent');
        if (!consent) {
            setTimeout(showCookieBanner, 500);
        }
    }

    function acceptCookies() {
        setCookie('cookieConsent', 'all', 365);
        setCookie('analyticsCookies', 'true', 365);
        setCookie('performanceCookies', 'true', 365);
        setTimeout(() => loadGoogleAnalytics(), 100);
        hideCookieBanner();
        updateManageCookieButton();
        console.log('✅ Cookies acceptés sur toute l\'application');
    }

    function rejectCookies() {
        setCookie('cookieConsent', 'rejected', 365);
        setCookie('analyticsCookies', 'false', 365);
        setCookie('performanceCookies', 'false', 365);
        hideCookieBanner();
        updateManageCookieButton();
        console.log('❌ Cookies refusés sur toute l\'application');
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
        updateManageCookieButton();
        
        console.log('⚙️ Préférences sauvegardées:', {
            analytics: analyticsChecked,
            performance: performanceChecked
        });
    }

    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        // path=/ pour que le cookie soit disponible sur tout le site
        document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax";
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

    // ============================================
    // FONCTIONS POUR LE TRACKING
    // ============================================

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

    let isGALoaded = false;
    let pendingEvents = [];

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

    function initAdvancedTracking() {
        console.log('🚀 Initialisation du tracking avancé...');
        
        document.addEventListener('click', function(e) {
            const target = e.target;
            const interactiveEl = target.closest('a, button, .btn, [role="button"], input[type="submit"], .mobile-menu, .mobile-close, .cookie-btn, .modal-btn, .social-link');
            
            if (!interactiveEl) return;

            const consent = getCookie('cookieConsent');
            const analytics = getCookie('analyticsCookies');
            if (!consent || consent === 'rejected' || !(consent === 'all' || (consent === 'custom' && analytics === 'true'))) return;

            setTimeout(() => trackUserAction(interactiveEl, 'click'), 50);
        });

        initScrollTracking();
        initTimeTracking();
        initErrorTracking();
        isGALoaded = true;
    }

    function trackUserAction(element, actionType) {
        const elementInfo = getElementInfo(element);
        const pageInfo = getPageInfo();
        
        const eventData = {
            'event_category': elementInfo.category,
            'event_label': `${elementInfo.text} - ${pageInfo.title}`,
            'element_type': elementInfo.type,
            'element_text': elementInfo.text,
            'element_location': elementInfo.location,
            'page_title': pageInfo.title,
            'page_category': pageInfo.category,
            'page_path': pageInfo.path
        };

        let eventName = 'user_click';
        
        if (elementInfo.type === 'navigation') {
            eventName = 'navigation_click';
        } else if (elementInfo.type === 'social') {
            eventName = 'social_click';
        } else if (element.classList.contains('cookie-btn')) {
            eventName = 'cookie_interaction';
        }

        safeGtag(eventName, eventData);
    }

    function initScrollTracking() {
        let scrollStates = { 25: false, 50: false, 75: false, 90: false };
        
        const trackScroll = function() {
            if (typeof gtag === 'undefined') return;
            
            const consent = getCookie('cookieConsent');
            const analytics = getCookie('analyticsCookies');
            if (!consent || consent === 'rejected' || !(consent === 'all' || (consent === 'custom' && analytics === 'true'))) return;

            const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
            
            Object.keys(scrollStates).forEach(threshold => {
                if (!scrollStates[threshold] && scrollPercent >= parseInt(threshold)) {
                    safeGtag('scroll_depth', {
                        'event_category': 'Engagement',
                        'event_label': `Scroll ${threshold}%`,
                        'scroll_percentage': threshold,
                        'page_title': getPageTitle()
                    });
                    scrollStates[threshold] = true;
                }
            });
        };

        const checkGALoaded = setInterval(() => {
            if (typeof gtag !== 'undefined') {
                window.addEventListener('scroll', trackScroll, { passive: true });
                clearInterval(checkGALoaded);
            }
        }, 100);
    }

    function initTimeTracking() {
        let startTime = Date.now();
        let maxTime = 0;
        
        window.addEventListener('beforeunload', function() {
            const consent = getCookie('cookieConsent');
            const analytics = getCookie('analyticsCookies');
            if (!consent || consent === 'rejected' || !(consent === 'all' || (consent === 'custom' && analytics === 'true'))) return;

            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            maxTime = Math.max(maxTime, timeSpent);
            
            if (maxTime > 5) {
                safeGtag('time_spent', {
                    'event_category': 'Engagement',
                    'event_label': `Temps sur la page`,
                    'time_seconds': maxTime,
                    'page_title': getPageTitle()
                });
            }
        });
    }

    function initErrorTracking() {
        window.addEventListener('error', function(e) {
            const consent = getCookie('cookieConsent');
            const analytics = getCookie('analyticsCookies');
            if (!consent || consent === 'rejected' || !(consent === 'all' || (consent === 'custom' && analytics === 'true'))) return;

            safeGtag('error_occurred', {
                'event_category': 'Error',
                'event_label': e.message,
                'error_message': e.message.substring(0, 100),
                'error_file': e.filename,
                'error_line': e.lineno,
                'page_title': getPageTitle()
            });
        });
    }

    function getElementInfo(element) {
        return {
            text: getElementText(element),
            type: getElementType(element),
            category: getElementCategory(element),
            location: getElementLocation(element)
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
        if (element.placeholder) return element.placeholder;
        return element.tagName.toLowerCase();
    }

    function getElementType(element) {
        if (element.tagName === 'A') {
            if (element.href && element.href.includes('discord')) return 'social';
            if (element.getAttribute('href') && !element.getAttribute('href').startsWith('#')) return 'navigation';
            return 'link';
        }
        if (element.tagName === 'BUTTON') return 'button';
        if (element.classList.contains('btn')) return 'button';
        if (element.type === 'submit') return 'submit';
        if (element.classList.contains('social-link')) return 'social';
        if (element.classList.contains('mobile-menu') || element.classList.contains('mobile-close')) return 'mobile_nav';
        if (element.classList.contains('cookie-btn')) return 'cookie';
        return 'interactive';
    }

    function getElementCategory(element) {
        const section = element.closest('section, header, footer, nav, main');
        if (!section) return 'Unknown';
        
        if (section.classList.contains('hero')) return 'Hero Section';
        if (section.classList.contains('cta')) return 'CTA Section';
        if (section.id === 'accueil') return 'Accueil Section';
        if (section.id === 'telecharger') return 'Download Section';
        if (section.tagName === 'HEADER') return 'Header';
        if (section.tagName === 'FOOTER') return 'Footer';
        if (section.tagName === 'NAV') return 'Navigation';
        return 'Content';
    }

    function getElementLocation(element) {
        const rect = element.getBoundingClientRect();
        return {
            visible: rect.top < window.innerHeight && rect.bottom > 0,
            position: `${Math.round(rect.top)}px from top`
        };
    }

    function getPageInfo() {
        return {
            title: getPageTitle(),
            category: getPageCategory(),
            path: window.location.pathname
        };
    }

    function loadGoogleAnalytics() {
        console.log('🔍 Chargement de Google Analytics...');
        
        const consent = getCookie('cookieConsent');
        const analytics = getCookie('analyticsCookies');
        
        if (consent === 'rejected') {
            console.log('❌ Cookies refusés - GA non chargé');
            return;
        }
        
        if (consent === 'all' || (consent === 'custom' && analytics === 'true')) {
            console.log('✅ Consentement OK, chargement GA...');
            
            if (window.dataLayer && window.gtag) {
                console.log('🔄 GA déjà chargé');
                flushPendingEvents();
                initAdvancedTracking();
                return;
            }
            
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
                    'page_path': window.location.pathname
                });
                
                gtag('event', 'page_view', getPageInfo());
                flushPendingEvents();
                initAdvancedTracking();
            };
            
            script.onerror = function() {
                console.error('❌ Erreur lors du chargement de Google Analytics');
            };
            
            document.head.appendChild(script);
        } else {
            console.log('❌ Pas de consentement pour Analytics');
        }
    }

    // ============================================
    // INITIALISATION
    // ============================================

    document.addEventListener('DOMContentLoaded', function() {
        console.log('📄 Page chargée:', window.location.pathname);
        
        const consent = getCookie('cookieConsent');
        
        // Synchroniser les préférences immédiatement
        syncCookiePreferences();
        
        if (!consent) {
            console.log('🔄 Aucun consentement, affichage bannière');
            setTimeout(showCookieBanner, 1000);
        } else {
            console.log('✅ Consentement déjà donné:', consent);
            
            if (consent !== 'rejected') {
                setTimeout(() => {
                    loadGoogleAnalytics();
                }, 100);
            }
        }
        
        updateManageCookieButton();
        
        const manageBtn = document.getElementById('reopen-cookie-settings');
        if (manageBtn) {
            manageBtn.addEventListener('click', reopenCookieSettings);
        }
        
        initMobileMenu();
        initSmoothScroll();
    });

    // ============================================
    // FONCTIONS MENU MOBILE ET SCROLL
    // ============================================

    function initMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileNav = document.getElementById('mobileNav');
        const overlay = document.getElementById('overlay');
        const mobileClose = document.getElementById('mobileClose');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        const body = document.body;

        if (!mobileMenu || !mobileNav || !overlay || !mobileClose) return;

        function openMobileMenu() {
            mobileNav.classList.add('active');
            overlay.classList.add('active');
            mobileMenu.classList.add('active');
            body.classList.add('no-scroll');
        }

        function closeMobileMenu() {
            mobileNav.classList.remove('active');
            overlay.classList.remove('active');
            mobileMenu.classList.remove('active');
            body.classList.remove('no-scroll');
        }

        function toggleMobileMenu() {
            if (mobileNav.classList.contains('active')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        }

        mobileMenu.addEventListener('click', toggleMobileMenu);
        overlay.addEventListener('click', closeMobileMenu);
        mobileClose.addEventListener('click', closeMobileMenu);

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    function initSmoothScroll() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#') {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }
