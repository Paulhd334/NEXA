<?php
$currentPage = 'contact';
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact - Armoni Solution</title>
    <link rel="stylesheet" href="../css/theme.css">
    <link rel="stylesheet" href="../css/contact.css">
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="container">
            <div class="header-content">
                <a href="../index.php" class="logo" onclick="scrollToTop()">
                    <img src="../images/svg/logo-armoni.svg" alt="Armoni Logo">
                </a>
                
                <!-- Navigation Desktop -->
                <nav class="nav desktop-nav">
                    <a href="../index.php" onclick="scrollToTop()">Accueil</a>
                    <a href="contact.php" class="active">Contact</a>
                </nav>

                <!-- Bouton Thème -->
                <div class="theme-toggle-container">
                    <span class="theme-toggle-label"></span>
                    <button class="theme-toggle-slider-labeled" id="themeToggle"></button>
                </div>

                <!-- Menu Burger pour Mobile -->
                <button class="mobile-menu-btn">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </div>
    </header>

    <!-- Overlay Menu Mobile -->
    <div class="mobile-nav-overlay">
        <button class="mobile-nav-close"></button>
        <div class="mobile-nav-content">
            <nav class="mobile-nav">
                <a href="../index.php" onclick="scrollToTop()">Accueil</a>
                <a href="contact.php" class="active">Contact</a>
            </nav>
        </div>
    </div>

    <!-- Contact Hero -->
    <section class="contact-hero">
        <div class="container">
            <div class="hero-content">
                <h1>Contactez-nous</h1>
                <p>Prêts à créer des moments exceptionnels ensemble ? Discutons de votre projet.</p>
            </div>
        </div>
    </section>

    <!-- Contact Content -->
    <section class="contact-content">
        <div class="container">
            <div class="contact-grid">
                <!-- Informations de contact -->
                <div class="contact-info">
                    <h2>Nos coordonnées</h2>
                    <p class="contact-description">
                        Notre équipe est à votre écoute pour répondre à toutes vos questions 
                        et vous accompagner dans la réalisation de vos projets.
                    </p>
                    
                    <div class="contact-details">
                        <div class="contact-item">
                            <div class="contact-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                </svg>
                            </div>
                            <div class="contact-text">
                                <h4>Email</h4>
                                <a href="mailto:armoni.consult@gmail.com">armoni.consult@gmail.com</a>
                            </div>
                        </div>
                        
                        <div class="contact-item">
                            <div class="contact-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/>
                                </svg>
                            </div>
                            <div class="contact-text">
                                <h4>Téléphone</h4>
                                <a href="tel:+0625200763">06 25 20 07 63</a>
                            </div>
                        </div>
                        
                        <div class="contact-item">
                            <div class="contact-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                </svg>
                            </div>
                            <div class="contact-text">
                                <h4>Réseaux sociaux</h4>
                                <a href="https://www.instagram.com/_armoni.s_" target="_blank" rel="noopener">Instagram</a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Formulaire de contact -->
                <div class="contact-form-container">
                    <h2>Envoyez-nous un message</h2>
                    <form action="../config/process_form.php" method="POST" class="contact-form" id="contactForm">
                        <div class="form-group">
                            <label for="name">Nom complet *</label>
                            <input type="text" id="name" name="name" required 
                                   placeholder="Votre nom complet">
                        </div>
                        
                        <div class="form-group">
                            <label for="email">Email *</label>
                            <input type="email" id="email" name="email" required 
                                   placeholder="votre@email.com">
                        </div>
                        
                        <div class="form-group">
                            <label for="phone">Téléphone</label>
                            <input type="tel" id="phone" name="phone" 
                                   placeholder="06 12 34 56 78">
                        </div>
                        
                        <div class="form-group">
                            <label for="service">Service concerné *</label>
                            <select id="service" name="service" required>
                                <option value="">Sélectionnez un service</option>
                                <option value="traiteur">Traiteur événementiel</option>
                                <option value="consulting">Consulting</option>
                                <option value="staff">Extra Staff</option>
                                <option value="autre">Autre</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="message">Message *</label>
                            <textarea id="message" name="message" rows="5" required 
                                      placeholder="Décrivez votre projet, vos besoins, la date prévue..."></textarea>
                        </div>
                        
                        <button type="submit" class="btn btn-primary">
                            <span class="btn-text">Envoyer le message</span>
                            <span class="btn-loading" style="display: none;">Envoi en cours...</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <h3>Armoni Solution</h3>
                    <p>Votre partenaire pour des événements culinaires réussis.</p>
                </div>
                
                <div class="footer-section">
                    <h4>Services</h4>
                    <ul class="footer-links">
                        <li><a href="../index.php#traiteur">Traiteur</a></li>
                        <li><a href="../index.php#consulting">Consulting</a></li>
                        <li><a href="../index.php#staff">Extra Staff</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h4>Contact</h4>
                    <ul class="footer-links">
                        <li><a href="tel:+0625200763">06 25 20 07 63</a></li>
                        <li><a href="mailto:armoni.consult@gmail.com">armoni.consult@gmail.com</a></li>
                        <li><a href="https://www.instagram.com/_armoni.s_" target="_blank" rel="noopener">Instagram</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h4>Légal</h4>
                    <ul class="footer-links">
                        <li><a href="../legal/mentions-legales.php">Mentions légales</a></li>
                        <li><a href="../legal/confidentialite.php">Confidentialité</a></li>
                        <li><a href="../legal/cgv.php">CGV</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; 2025 Armoni Solution. Tous droits réservés.</p>
            </div>
        </div>
    </footer>

    <script src="../js/script.js"></script>
    <script>
        // Gestion du formulaire
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            const btn = this.querySelector('button[type="submit"]');
            const btnText = btn.querySelector('.btn-text');
            const btnLoading = btn.querySelector('.btn-loading');
            
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
            btn.disabled = true;
        });

        // Validation du téléphone
        document.getElementById('phone').addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9+\s]/g, '');
        });
    </script>
</body>
</html>