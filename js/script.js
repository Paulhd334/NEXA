// Gestion du menu mobile et du thème
document.addEventListener('DOMContentLoaded', function() {
    console.log('Script loaded - Mobile menu initialization'); // Debug
    
    // === GESTION DU MENU MOBILE ===
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const body = document.body;
    
    console.log('Mobile elements:', { mobileMenuBtn, mobileNavOverlay, mobileNavClose }); // Debug
    
    if (mobileMenuBtn && mobileNavOverlay) {
        // Ouvrir le menu
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Menu button clicked'); // Debug
            this.classList.toggle('active');
            mobileNavOverlay.classList.toggle('active');
            body.classList.toggle('menu-open');
        });
        
        // Fermer le menu
        function closeMenu() {
            console.log('Closing menu'); // Debug
            mobileMenuBtn.classList.remove('active');
            mobileNavOverlay.classList.remove('active');
            body.classList.remove('menu-open');
        }
        
        // Fermer avec le bouton de fermeture
        if (mobileNavClose) {
            mobileNavClose.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                closeMenu();
            });
        }
        
        // Fermer en cliquant sur un lien (pour les deux pages)
        const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Ne pas fermer immédiatement pour permettre la navigation
                setTimeout(closeMenu, 300);
            });
        });
        
        // Fermer en cliquant en dehors du contenu
        mobileNavOverlay.addEventListener('click', function(e) {
            if (e.target === mobileNavOverlay) {
                closeMenu();
            }
        });
        
        // Fermer avec la touche Echap
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileNavOverlay.classList.contains('active')) {
                closeMenu();
            }
        });
    } else {
        console.log('Mobile menu elements not found'); // Debug
    }

    // === GESTION DU THÈME ===
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const currentTheme = localStorage.getItem('theme') || 'light';
        
        // Appliquer le thème au chargement
        document.body.classList.toggle('dark-theme', currentTheme === 'dark');
        
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // === FONCTION SCROLL TO TOP ===
    window.scrollToTop = function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        return false;
    };

    // === CORRECTION DU DÉFILEMENT POUR LES ANCRES ===
    const header = document.querySelector('.header');
    if (header) {
        const headerHeight = header.offsetHeight;
        document.documentElement.style.setProperty('--scroll-padding', headerHeight + 20 + 'px');
        
        const sections = document.querySelectorAll('section[id]');
        sections.forEach(section => {
            section.style.scrollMarginTop = headerHeight + 20 + 'px';
        });
    }
});





     // === JS POUR LE SLIDER ===



const slides = document.querySelectorAll('.hero-slide');
const leftBtn = document.querySelector('.hero-nav.left');
const rightBtn = document.querySelector('.hero-nav.right');
const indicatorsContainer = document.querySelector('.hero-indicators');
let current = 0;
let timer;

// Création des indicateurs
function createIndicators() {
  slides.forEach((_, index) => {
    const indicator = document.createElement('button');
    indicator.className = `hero-indicator ${index === 0 ? 'active' : ''}`;
    indicator.setAttribute('aria-label', `Aller au slide ${index + 1}`);
    indicator.addEventListener('click', () => {
      goToSlide(index);
      resetAuto();
    });
    indicatorsContainer.appendChild(indicator);
  });
}

function showSlide(i) {
  // Retirer la classe active de tous les slides et indicateurs
  slides.forEach(slide => slide.classList.remove('active'));
  const indicators = document.querySelectorAll('.hero-indicator');
  indicators.forEach(indicator => indicator.classList.remove('active'));
  
  // Ajouter la classe active au slide et indicateur courant
  slides[i].classList.add('active');
  if (indicators[i]) {
    indicators[i].classList.add('active');
  }
  
  // Mettre à jour l'index courant
  current = i;
  
  // Mettre à jour l'accessibilité
  updateAriaLabels();
}

function nextSlide() {
  const next = (current + 1) % slides.length;
  showSlide(next);
}

function prevSlide() {
  const prev = (current - 1 + slides.length) % slides.length;
  showSlide(prev);
}

function goToSlide(index) {
  if (index >= 0 && index < slides.length) {
    showSlide(index);
  }
}

// Navigation au clavier
function handleKeyboardNavigation(e) {
  if (e.key === 'ArrowLeft') {
    prevSlide();
    resetAuto();
  } else if (e.key === 'ArrowRight') {
    nextSlide();
    resetAuto();
  } else if (e.key >= '1' && e.key <= '9') {
    const slideIndex = parseInt(e.key) - 1;
    if (slideIndex < slides.length) {
      goToSlide(slideIndex);
      resetAuto();
    }
  }
}

// Mise à jour des labels ARIA pour l'accessibilité
function updateAriaLabels() {
  slides.forEach((slide, index) => {
    slide.setAttribute('aria-hidden', index !== current);
    slide.setAttribute('aria-label', `Slide ${index + 1} sur ${slides.length}`);
  });
}

// Auto carousel
function resetAuto() {
  clearInterval(timer);
  timer = setInterval(nextSlide, 5000);
}

// Pause auto-carousel quand la souris est sur le banner
function setupAutoPause() {
  const heroBanner = document.querySelector('.hero-banner');
  
  heroBanner.addEventListener('mouseenter', () => {
    clearInterval(timer);
  });
  
  heroBanner.addEventListener('mouseleave', () => {
    resetAuto();
  });
  
  // Pause aussi quand la fenêtre n'est pas visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(timer);
    } else {
      resetAuto();
    }
  });
}

// Navigation boutons
rightBtn.addEventListener('click', () => {
  nextSlide();
  resetAuto();
});

leftBtn.addEventListener('click', () => {
  prevSlide();
  resetAuto();
});

// Navigation clavier
document.addEventListener('keydown', handleKeyboardNavigation);

// Swipe pour mobile
function setupSwipe() {
  const heroBanner = document.querySelector('.hero-banner');
  let startX = 0;
  let endX = 0;
  
  heroBanner.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });
  
  heroBanner.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
  });
  
  function handleSwipe() {
    const diff = startX - endX;
    const swipeThreshold = 50;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe gauche
        nextSlide();
      } else {
        // Swipe droite
        prevSlide();
      }
      resetAuto();
    }
  }
}

// Initialisation
function initHeroSlider() {
  createIndicators();
  showSlide(current);
  setupAutoPause();
  setupSwipe();
  resetAuto();
}

// Démarrer le slider quand la page est chargée
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeroSlider);
} else {
  initHeroSlider();
}
