<?php
$currentPage = 'contact';
$serviceType = 'Service en salle';
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demande de Service - Armoni Solution</title>
    <link rel="stylesheet" href="../../css/formulaire.css">
</head>
<body>

  <!-- Header -->
    <header class="header">
        <div class="container">
         <a href="../../index.php" class="logo">
    <img src="../../images/svg/logo-armoni.svg" alt="Armoni Logo">
</a>

            <nav class="nav">
                <a href="../../index.php" class="active">Accueil</a>
                <a href="../../Contact/contact.php">Contact</a>
            </nav>
        </div>
    </header>

    <!-- Hero Formulaire -->
    <section class="contact-hero">
        <div class="container">
            <h1>Demande de Service en Salle</h1>
            <p>Personnel qualifié pour votre service - 30€/h</p>
        </div>
    </section>

    <!-- Formulaire Service -->
    <section class="contact-content">
        <div class="container">
            <div class="contact-grid">
                <div class="contact-info">
                    <h2>Service en Salle</h2>
                    <p>Notre personnel de service est formé pour assurer un service professionnel et efficace dans votre établissement.</p>
                </div>

                <div class="contact-form">
                    <h2>Formulaire de demande</h2>
                    <form action="#" method="POST">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="nom">Nom *</label>
                                <input type="text" id="nom" name="nom" required>
                            </div>
                            <div class="form-group">
                                <label for="prenom">Prénom *</label>
                                <input type="text" id="prenom" name="prenom" required>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="email">Adresse mail *</label>
                                <input type="email" id="email" name="email" required>
                            </div>
                            <div class="form-group">
                                <label for="telephone">Téléphone *</label>
                                <input type="tel" id="telephone" name="telephone" required>
                            </div>
                        </div>



                        <div class="form-row">
                            <div class="form-group">
                                <label for="date_debut">Date de début souhaitée *</label>
                                <input type="date" id="date_debut" name="date_debut" required>
                            </div>
                            <div class="form-group">
                                <label for="duree">Durée estimée</label>
                                <select id="duree" name="duree">
                                    <option value="">Sélectionnez</option>
                                    <option value="ponctuel">Ponctuel (1 jour)</option>
                                    <option value="semaine">Une semaine</option>
                                    <option value="mois">Un mois</option>
                                    <option value="long">Long terme</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="nombre_personnes">Nombre de personnes nécessaires *</label>
                            <select id="nombre_personnes" name="nombre_personnes" required>
                                <option value="">Sélectionnez</option>
                                <option value="1">1 personne</option>
                                <option value="2">2 personnes</option>
                                <option value="3">3 personnes</option>
                                <option value="4">4 personnes</option>
                                <option value="5+">5 personnes ou plus</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="horaires">Horaires prévus *</label>
                            <input type="text" id="horaires" name="horaires" placeholder="Ex: 18h-00h, week-end..." required>
                        </div>

                        <div class="form-group">
                            <label for="type_service">Type de service *</label>
                            <select id="type_service" name="type_service" required>
                                <option value="">Sélectionnez</option>
                                <option value="restaurant">Service restaurant</option>
                                <option value="bar">Service bar</option>
                                <option value="evenement">Service événementiel</option>
                                <option value="reception">Service réception</option>
                                <option value="autre">Autre</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="message">Détails supplémentaires</label>
                            <textarea id="message" name="message" rows="4" placeholder="Type d'établissement, spécificités, uniforme requis..."></textarea>
                        </div>

                        <div class="price-summary">
                            <div class="price-item">
                                <span>Service en salle</span>
                                <span>30€/h</span>
                            </div>
                            <div class="price-total">
                                <span>Tarif horaire</span>
                                <span>30€/h</span>
                            </div>
                        </div>

                        <input type="hidden" name="service_type" value="service_salle">

                        <button type="submit" class="btn-primary">Envoyer la demande</button>
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
             <p>Votre partenaire pour des événements et prestations culinaires depuis 2010.</p>
                </div>
                <div class="footer-section">
                    <h4>Services</h4>
                    <ul class="footer-links">
                        <li><a href="index.php#traiteur">Traiteur</a></li>
                        <li><a href="index.php#consulting">Consulting</a></li>
                        <li><a href="index.php#staff">Extra Staff</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Contact</h4>
                    <ul class="footer-links">
                        <li><a href="tel:+0625200763">06 25 20 07 63</a></li>
                        <li><a href="mailto:armoni.consult@gmail.com">armoni.consult@gmail.com</a></li>
                        <li><a href="https://www.instagram.com/_armoni.s_" target="_blank">Instagram</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Legal</h4>
                    <ul class="footer-links">
                        <li><a href="#">Mentions légales</a></li>
                        <li><a href="#">Confidentialité</a></li>
                        <li><a href="#">CGV</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025 Armoni Solution. Tous droits réservés.</p>
            </div>
        </div>
    </footer>
</body>
</html>
