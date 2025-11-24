<?php
$currentPage = 'contact';
$serviceType = 'Management';
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demande de Management - Armoni Solution</title>
    <link rel="stylesheet" href="../../css/Formulaire.css">
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
            <h1>Demande de Management</h1>
            <p>Encadrement d'équipe professionnel - à partir de 40€/h</p>
        </div>
    </section>

<br><br>

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

                        <div class="form-group">
                            <label for="entreprise">Nom de l'établissement *</label>
                            <input type="text" id="entreprise" name="entreprise" required>
                        </div>

                        <div class="form-group">
                            <label for="type_etablissement">Type d'établissement *</label>
                            <select id="type_etablissement" name="type_etablissement" required>
                                <option value="">Sélectionnez</option>
                                <option value="restaurant">Restaurant</option>
                                <option value="brasserie">Brasserie</option>
                                <option value="bar">Bar</option>
                                <option value="hotel">Hôtel</option>
                                <option value="traiteur">Traiteur</option>
                                <option value="autre">Autre</option>
                            </select>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="date_debut">Date de début souhaitée *</label>
                                <input type="date" id="date_debut" name="date_debut" required>
                            </div>
                            <div class="form-group">
                                <label for="duree_mission">Durée de la mission</label>
                                <select id="duree_mission" name="duree_mission">
                                    <option value="">Sélectionnez</option>
                                    <option value="ponctuel">Ponctuel</option>
                                    <option value="1-3mois">1 à 3 mois</option>
                                    <option value="3-6mois">3 à 6 mois</option>
                                    <option value="6mois+">6 mois ou plus</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="taille_equipe">Taille de l'équipe à manager *</label>
                            <select id="taille_equipe" name="taille_equipe" required>
                                <option value="">Sélectionnez</option>
                                <option value="1-5">1 à 5 personnes</option>
                                <option value="6-10">6 à 10 personnes</option>
                                <option value="11-20">11 à 20 personnes</option>
                                <option value="20+">Plus de 20 personnes</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="horaires_travail">Horaires de travail *</label>
                            <select id="horaires_travail" name="horaires_travail" required>
                                <option value="">Sélectionnez</option>
                                <option value="journee">Journée</option>
                                <option value="soiree">Soirée</option>
                                <option value="mixte">Mixte jour/soir</option>
                                <option value="weekend">Week-end</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="objectifs">Objectifs principaux *</label>
                            <textarea id="objectifs" name="objectifs" rows="3" placeholder="Amélioration du service, formation équipe, gestion des stocks..." required></textarea>
                        </div>

                        <div class="form-group">
                            <label for="challenges">Défis spécifiques</label>
                            <textarea id="challenges" name="challenges" rows="3" placeholder="Problèmes actuels, difficultés rencontrées..."></textarea>
                        </div>

                        <div class="form-group">
                            <label for="budget">Budget estimé (optionnel)</label>
                            <input type="text" id="budget" name="budget" placeholder="Ex: 200€">
                        </div>

                        <input type="hidden" name="service_type" value="management"> <br>

                        <button type="submit" class="btn">Envoyer la demande</button>
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
                        <li><a href="../../index.php#traiteur">Traiteur</a></li>
                        <li><a href="../../index.php#consulting">Consulting</a></li>
                        <li><a href="../../index.php#staff">Extra Staff</a></li>
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
