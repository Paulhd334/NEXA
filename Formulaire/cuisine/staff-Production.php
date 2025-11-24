<?php
session_start();

// Page variables
$currentPage = 'contact';
$serviceType = 'Staff Production';

// Generate CSRF token once per session
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// Helper to repopulate values after POST (optional)
function old($key) {
    return htmlspecialchars($_POST[$key] ?? '', ENT_QUOTES);
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demande de Staff Production - Armoni Solution</title>
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
                <a href="Contact/contact.php">Contact</a>
            </nav>
        </div>
    </header>

    <!-- Hero Formulaire -->
    <section class="contact-hero">
        <div class="container">
            <h1>Demande Production & Service cuisine</h1>
            <p>Personnel de production et de cuisine – à partir de 25€/h</p>
        </div>
    </section>

    <!-- Formulaire -->
    <section class="contact-form-section">
        <div class="container">
            <div class="contact-form">
                <h2>Formulaire de demande</h2>
                <form action="contact_process.php" method="POST" novalidate>
                    <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="nom">Nom *</label>
                            <input type="text" id="nom" name="nom" required value="<?php echo old('nom'); ?>">
                        </div>
                        <div class="form-group">
                            <label for="prenom">Prénom *</label>
                            <input type="text" id="prenom" name="prenom" required value="<?php echo old('prenom'); ?>">
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="email">Adresse mail *</label>
                            <input type="email" id="email" name="email" required value="<?php echo old('email'); ?>">
                        </div>
                        <div class="form-group">
                            <label for="telephone">Téléphone *</label>
                            <input type="tel" id="telephone" name="telephone" required value="<?php echo old('telephone'); ?>">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="entreprise">Nom de l'établissement *</label>
                        <input type="text" id="entreprise" name="entreprise" required value="<?php echo old('entreprise'); ?>">
                    </div>

                    <div class="form-group">
                        <label for="type_etablissement">Type d'établissement *</label>
                        <select id="type_etablissement" name="type_etablissement" required>
                            <option value="">Sélectionnez</option>
                            <option value="restaurant" <?php if(old('type_etablissement')==='restaurant') echo 'selected'; ?>>Restaurant</option>
                            <option value="traiteur" <?php if(old('type_etablissement')==='traiteur') echo 'selected'; ?>>Traiteur</option>
                            <option value="hotel" <?php if(old('type_etablissement')==='hotel') echo 'selected'; ?>>Hôtel</option>
                            <option value="evenementiel" <?php if(old('type_etablissement')==='evenementiel') echo 'selected'; ?>>Événementiel</option>
                            <option value="autre" <?php if(old('type_etablissement')==='autre') echo 'selected'; ?>>Autre</option>
                        </select>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="date_debut">Date de début souhaitée *</label>
                            <input type="date" id="date_debut" name="date_debut" required value="<?php echo old('date_debut'); ?>">
                        </div>
                        <div class="form-group">
                            <label for="duree_mission">Durée de la mission</label>
                            <select id="duree_mission" name="duree_mission">
                                <option value="">Sélectionnez</option>
                                <option value="ponctuel" <?php if(old('duree_mission')==='ponctuel') echo 'selected'; ?>>Ponctuel</option>
                                <option value="1-3mois" <?php if(old('duree_mission')==='1-3mois') echo 'selected'; ?>>1 à 3 mois</option>
                                <option value="3-6mois" <?php if(old('duree_mission')==='3-6mois') echo 'selected'; ?>>3 à 6 mois</option>
                                <option value="6mois+" <?php if(old('duree_mission')==='6mois+') echo 'selected'; ?>>6 mois ou plus</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
    <label>Poste(s) recherché(s) *</label>
    <div class="checkbox-group">

            <span></span>
        <label class="checkbox-label">
            <input type="checkbox" name="poste_recherche[]" value="plongeur" <?php if(in_array('plongeur', $_POST['poste_recherche'] ?? [])) echo 'checked'; ?>>
            <span>Plongeur</span>
        </label>


        <label class="checkbox-label">
            <input type="checkbox" name="poste_recherche[]" value="chef_cuisine" <?php if(in_array('chef_cuisine', $_POST['poste_recherche'] ?? [])) echo 'checked'; ?>>
            <span>Cuisiner </span>
        </label>
                <label class="checkbox-label">
            <input type="checkbox" name="poste_recherche[]" value="chef_de_partie" <?php if(in_array('chef_de_partie', $_POST['poste_recherche'] ?? [])) echo 'checked'; ?>>
            <span>Chef de cusine </span>
        </label>

    </div>
</div>

<br>



          

                    <input type="hidden" name="service_type" value="staff-production">  <br>

                    <button type="submit" class="btn-primary">Envoyer la demande</button>
                </form>
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
