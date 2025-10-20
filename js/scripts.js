document.addEventListener('DOMContentLoaded', function() {
            // Scroll to Top Button
            const scrollToTopBtn = document.getElementById('scrollToTop');
            
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    scrollToTopBtn.classList.add('active');
                } else {
                    scrollToTopBtn.classList.remove('active');
                }
            });
            
            scrollToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            
            // Screenshot Modal
            const screenshotCards = document.querySelectorAll('.screenshot-card');
            const modal = document.getElementById('screenshotModal');
            const modalImage = document.getElementById('modalImage');
            const modalClose = document.querySelector('.modal-close');
            
            screenshotCards.forEach(card => {
                card.addEventListener('click', () => {
                    const imgSrc = card.querySelector('img').src;
                    modalImage.src = imgSrc;
                    modal.classList.add('active');
                });
            });
            
            modalClose.addEventListener('click', () => {
                modal.classList.remove('active');
            });
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
            
            // Mobile Menu Toggle
            const mobileMenuBtn = document.querySelector('.mobile-menu');
            const navLinks = document.querySelector('.nav-links');
            const navActions = document.querySelector('.nav-actions');
            
            mobileMenuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                navActions.classList.toggle('active');
            });
        });




  // Quand la page est complètement chargée
  window.addEventListener('load', function() {
    // Vérifie si l'URL contient un hash
    if(window.location.hash) {
      // Supprime le hash sans recharger la page
      history.replaceState(null, null, window.location.pathname + window.location.search);
    }
  });



