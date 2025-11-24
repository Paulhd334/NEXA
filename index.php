<?php
$currentPage = 'accueil';
$services = [
    [
        'id' => 'traiteur',
        'icon' => '',
        'title' => 'Traiteur Événementiel',
        'description' => 'TEXT EN ATTENTE.',
        'features' => ['Prestations', 'Carte', 'Photos'],
        'illustration' => ''
    ],
    [
        'id' => 'consulting',
        'icon' => '',
        'title' => 'Consulting',
        'description' => 'Qui renonce a devenir meilleur cesse d être bon',
        'features' => ['Aide au recrutement','Teams Building', 'Stratégie', 'Optimisation', 'Formation'],
        'illustration' => ''
    ],
    [
        'id' => 'staff',
        'icon' => '',
        'title' => 'Extra Staff',
        'description' => 'Mise à disposition de personnel qualifié pour renforcer vos équipes temporairement. Service, cuisine et bar : nous sélectionnons les profils adaptés à vos besoins spécifiques.',
        'features' => ['Service', 'Cuisine', 'Logistique'],
        'illustration' => ''
    ]
];

$tarifs = [
    'operationnel' => [
        'SALLE' => [
            'Service' => 'à partir de 30€/h',
            'Management' => 'à partir de 40€/h'
        ],
        'CUISINE' => [
            'Pizzaiolo' => 'à partir de 30€/h',
            'Prod & service cuisine' => 'à partir de 25€/h'
        ]
    ],
    'conseil' => [
        'Conseil' => 'à partir de 75€/h',
        'Aide au recrutement' => 'sur devis',
        'Team building Formation' => 'sur devis',
        'Direction artistique' => 'sur devis',
        'Marketing' => 'sur devis',
        'Stratégies & Développement' => 'sur devis'
    ]
];
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Armoni Solution</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/theme.css">
    <meta name="description" content="Armoni Solution - Traiteur, consulting, Expertise événementiel et restauration.">
    
    <!-- Favicon & Manifest -->
    <link rel="icon" href="images/favicon/favicon.ico" sizes="any">
    <link rel="icon" href="images/favicon/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="images/favicon/web-app-manifest-192x192.png">
    <link rel="manifest" href="site.webmanifest">
    
    <!-- Thème couleur pour les navigateurs mobiles -->
    <meta name="theme-color" content="#000000">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Ar Moni">
    
    <!-- Autres métadonnées -->
    <meta name="description" content="Traiteur Événementiel, Consulting et Services Armoni Solution">
    <meta name="keywords" content="traiteur, événementiel, consulting, staff, catering, organisation">
</head>
<body>

<!-- Header -->
<header class="header">
    <div class="container">
        <div class="header-content">
            <a href="#" class="logo" onclick="scrollToTop()">
                <img src="images/svg/logo-armoni.svg" alt="Armoni Logo">
            </a>

            <!-- Navigation Desktop -->
            <nav class="nav desktop-nav">
                <a href="#" class="active" onclick="scrollToTop()">Accueil</a>
                <a href="Contact/contact.php">Contact</a>
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
            <a href="#" class="active" onclick="scrollToTop()">Accueil</a>
            <a href="#presentation">Présentation</a>
            <a href="#traiteur">Traiteur Événementiel</a>
            <a href="#consulting">Consulting</a>
            <a href="#extra-staff">Extra Staff</a>
            <a href="#fondateur">Fondateur</a>
            <a href="#teambuilding">Team Building</a>
        </nav>
    </div>
</div>

<script>
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    return false;
}
</script>

<br><br><br>
<!-- Hero Section -->
<section class="hero">
    <div class="container">
        <div class="hero-content">
            <div class="hero-text">
                <h1>L'excellence au service de vos événements</h1>
                <p>Traiteur, consulting et staffing pour vos besoins</p>
            </div>
            
         
            
            <!-- Instagram -->
            <div class="hero-instagram">
                <a href="https://www.instagram.com/_armoni.s_" target="_blank" class="instagram-link">
                    <span>Instagram</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-10.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="currentColor"/>
                    </svg>
                </a>
            </div>
        </div>
        
        <!-- Logo à droite -->
        <div class="hero-visual">
            <div class="logo-armoni-hero">
                <img src="images/svg/logo-armoni.svg" alt="Armoni Solution">
            </div>
        </div>
    </div>
</section>




<div class="hero-banner">
  <div class="hero-slide active" style="background-image:url('images/restaurations/image-en-gros-plan-d-une-table-de-fete-avec-differents-plats-evenement-festif-fete-ou-reception-de-mariage.jpg');">
    <div class="hero-content">
      <div class="hero-text-banner">
        <h1>Découvrez Notre Univers</h1>
        <h2>— Excellence et Innovation —</h2>
      </div>
    </div>
  </div>
  <div class="hero-slide" style="background-image:url('images/restaurations/snacks-avec-crevettes-a-cuiller-sur-buffet-table.jpg');">
    <div class="hero-content">
      <div class="hero-text-banner">
        <h1>Qualité Supérieure</h1>
        <h2>—20 —</h2>
      </div>
    </div>
  </div>
  <div class="hero-slide" style="background-image:url('images/Main_Plateau.png');">
    <div class="hero-content">
      <div class="hero-text-banner">
        <h1>Votre Partenaire de Confiance</h1>
        <h2>— Engagement & Performance —</h2>
      </div>
    </div>
  </div>
  
  <button class="hero-nav left" aria-label="Slide précédent">&#10094;</button>
  <button class="hero-nav right" aria-label="Slide suivant">&#10095;</button>
  
  <div class="hero-indicators"></div>
</div>

<script>

</script>


<!-- Main Content -->

<!-- Main Content -->
<main class="main-content">
    <div class="container">
        <div class="content-layout">
            <!-- Sidebar Menu Gauche -->
            <aside class="sidebar left-sidebar">
                <nav class="sidebar-nav">
                    <!-- Présentation en premier dans la sidebar -->
                    <a href="#presentation" class="sidebar-item">
                        <span class="sidebar-icon"></span>
                        <span class="sidebar-text">Présentation</span>
                    </a>
                    <!-- Services ensuite -->
                    <?php foreach ($services as $service): ?>
                    <a href="#<?php echo $service['id']; ?>" class="sidebar-item">
                        <span class="sidebar-icon"><?php echo $service['icon']; ?></span>
                        <span class="sidebar-text"><?php echo htmlspecialchars($service['title']); ?></span>
                    </a>
                    <?php endforeach; ?>
                    <a href="#fondateur" class="sidebar-item">
                        <span class="sidebar-icon"></span>
                        <span class="sidebar-text">Fondateur</span>
                    </a>
                    <a href="#teambuilding" class="sidebar-item">
                        <span class="sidebar-icon"></span>
                        <span class="sidebar-text">Team building</span>
                    </a>
                </nav>
            </aside>

            <!-- Services Content -->
            <div class="services-content">
                <!-- Présentation en premier dans le contenu principal -->
                <section id="presentation" class="service-section">
                    <div class="service-header">
                        <div class="service-title-group">
                            <span class="service-icon"></span>
                            <h2>Présentation</h2>
                        </div>
                    </div>
                    
                    <div class="presentation-content">
                        <p class="service-description">
                            Armoni solutions est une entreprise spécialisée dans le conseil, l'analyse et le développement d'activité auprès des professionnels de l'événementiel et de la restauration.
                        </p>
                        
                        <div class="text-block">
                            <p>Véritable soutien aux entreprises naissantes, stagnantes ou tout simplement dans le désir de se développer, Armoni propose des solutions sur mesures grâce à des analyses expertes fondées sur des années de pratique.</p>
                            <p>Recrutement, formation, management, structuration, marketing, direction artistique, communication… Nombreux sont les points pouvant créer des situations bloquantes diminuant la rentabilité d'une affaire.</p>
                            <p>Pouvoir les débloquer efficacement est la mission que nous nous fixons. Identifier les problématiques, est plus utile encore si on a la capacité de les traiter…</p>
                            <p>Pour s'en donner les moyens Armoni solutions s'appuie donc sur un important réseau professionnel dû à de nombreuses années de terrain.</p>
                            <p>Une clientèle à reconquérir ? Une activité à lancer ou relancer ? Une équipe à constituer, à former ? une ouverture à organiser, un projet à développer ?</p>
                            <p>Notre réseau est constitué de professionnels évalués par nos soins. En plus d'une expertise et d'un accompagnement, vous aurez donc aussi la possibilité d'accéder à du personnel compétent et efficace, selon vos besoins.</p>
                            <p>La formation et le team building sont le prolongement de notre activité. Transmettre des valeurs tout en faisant monter en compétences. Guider vers la pleine maitrise de ses capacités.</p>
                            <p>Trouver et faire éclore les nouveaux talents. Produire du savoir-faire, du savoir-être mais aussi du savoir vendre.</p>
                            <p class="highlight-text">Au plaisir de vous compter parmi nos clients, partenaires ou collaborateurs.</p>
                        </div>
                    </div>
                </section>

                <!-- Services après la présentation -->
                <?php foreach ($services as $service): ?>
                <section id="<?php echo $service['id']; ?>" class="service-section">
                    <div class="service-header">
                        <div class="service-title-group">
                            <span class="service-icon"><?php echo $service['icon']; ?></span>
                            <h2><?php echo htmlspecialchars($service['title']); ?></h2>
                        </div>
                        <div class="service-illustration">
                            <?php echo $service['illustration']; ?>
                        </div>
                    </div>
                    
                    <p class="service-description"><?php echo htmlspecialchars($service['description']); ?></p>
                    
                    <div class="service-features">
                        <?php foreach ($service['features'] as $feature): ?>
                        <div class="feature-item">
                            <span class="feature-dot"></span>
                            <span class="feature-text"><?php echo htmlspecialchars($feature); ?></span>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </section>
                <?php endforeach; ?>

                <!-- Fondateur -->
                <section id="fondateur" class="service-section">
                    <div class="service-header">
                        <div class="service-title-group">
                            <span class="service-icon"></span>
                            <h2>Fondateur</h2>
                        </div>
                    </div>
                    
                    <div class="fondateur-content">
                        <div class="fondateur-header">
                            <h3>Fondateur : Fabien Adamini</h3>
                        </div>
                        <div class="text-block">
                            <p class="highlight-text">TEXT EN ATTENTE</p>
                        </div>
                    </div>
                </section>

                <!-- Tarifs Section -->
                <div class="tarifs-content">
                    <!-- Section SALLE -->
                    <div class="tarif-section">
                        <div class="tarif-section-header">
                            <span class="tarif-section-icon"></span>
                            <h3 class="tarif-section-title">Salle Extra Staff</h3>
                        </div>
                        <div class="tarif-items">
                            <button class="tarif-item-btn" onclick="window.location.href='Formulaire/Salles/staff-service.php'">
                                <div class="tarif-service-info">
                                    <span class="tarif-service">Service</span>
                                    <span class="tarif-desc">Personnel en salle</span>
                                </div>
                                <div class="tarif-price-btn">
                                    <span class="tarif-prix">à partir de 30€/h</span>
                                    <span class="btn-arrow">→</span>
                                </div>
                            </button>

                            <button class="tarif-item-btn" onclick="window.location.href='Formulaire/Salles/staff-management.php'">
                                <div class="tarif-service-info">
                                    <span class="tarif-service">Management</span>
                                    <span class="tarif-desc">Encadrement d'équipe</span>
                                </div>
                                <div class="tarif-price-btn">
                                    <span class="tarif-prix">à partir de 40€/h</span>
                                    <span class="btn-arrow">→</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    <!-- Section CUISINE -->
                    <div class="tarif-section">
                        <div class="tarif-section-header">
                            <span class="tarif-section-icon"></span>
                            <h3 class="tarif-section-title">Cuisine</h3>
                        </div>
                        <div class="tarif-items">
                            <button class="tarif-item-btn" onclick="window.location.href='Formulaire/cuisine/staff-Pizzaiolo.php'">
                                <div class="tarif-service-info">
                                    <span class="tarif-service">Pizzaiolo</span>
                                    <span class="tarif-desc">Spécialiste pizza</span>
                                </div>
                                <div class="tarif-price-btn">
                                    <span class="tarif-prix">à partir de 30€/h</span>
                                    <span class="btn-arrow">→</span>
                                </div>
                            </button>

                            <button class="tarif-item-btn" onclick="window.location.href='Formulaire/cuisine/staff-Production.php'">
                                <div class="tarif-service-info">
                                    <span class="tarif-service">Production & Service cuisine</span>
                                    <span class="tarif-desc">Cuisine générale</span>
                                </div>
                                <div class="tarif-price-btn">
                                    <span class="tarif-prix">à partir de 25€/h</span>
                                    <span class="btn-arrow">→</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sidebar Menu Droit - VIDE -->
            <aside class="sidebar right-sidebar">
                <!-- Sidebar droite vide -->
            </aside>
        </div>
    </div>
</main>


    <div class="container">
        <div class="content-layout">
            <!-- Sidebar Menu Gauche -->
            <aside class="sidebar left-sidebar">
                <nav class="sidebar-nav">
                    <?php foreach ($services as $service): ?>
                    <a href="#<?php echo $service['id']; ?>" class="sidebar-item">
                        <span class="sidebar-icon"><?php echo $service['icon']; ?></span>
                        <span class="sidebar-text"><?php echo htmlspecialchars($service['title']); ?></span>
                    </a>
                    <?php endforeach; ?>
                    <a href="#presentation" class="sidebar-item">
                        <span class="sidebar-icon"></span>
                        <span class="sidebar-text">Présentation</span>
                    </a>
                    <a href="#fondateur" class="sidebar-item">
                        <span class="sidebar-icon"></span>
                        <span class="sidebar-text">Fondateur</span>
                    </a>
                    <a href="#teambuilding" class="sidebar-item">
                        <span class="sidebar-icon"></span>
                        <span class="sidebar-text">Team building</span>
                    </a>
                </nav>
            </aside>

            <!-- Services Content -->
            <div class="services-content">
                <!-- Services -->
                <?php foreach ($services as $service): ?>
                <section id="<?php echo $service['id']; ?>" class="service-section">
                    <div class="service-header">
                        <div class="service-title-group">
                            <span class="service-icon"><?php echo $service['icon']; ?></span>
                            <h2><?php echo htmlspecialchars($service['title']); ?></h2>
                        </div>
                        <div class="service-illustration">
                            <?php echo $service['illustration']; ?>
                        </div>
                    </div>
                    
                    <p class="service-description"><?php echo htmlspecialchars($service['description']); ?></p>
                    
                    <div class="service-features">
                        <?php foreach ($service['features'] as $feature): ?>
                        <div class="feature-item">
                            <span class="feature-dot"></span>
                            <span class="feature-text"><?php echo htmlspecialchars($feature); ?></span>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </section>
                <?php endforeach; ?>

                <!-- Présentation -->
                <section id="presentation" class="service-section">
                    <div class="service-header">
                        <div class="service-title-group">
                            <span class="service-icon"></span>
                            <h2>Présentation</h2>
                        </div>
                    </div>
                    
                    <div class="presentation-content">
                        <p class="service-description">
                            Armoni solutions est une entreprise spécialisée dans le conseil, l'analyse et le développement d'activité auprès des professionnels de l'événementiel et de la restauration.
                        </p>
                        
                        <div class="text-block">
                            <p>Véritable soutien aux entreprises naissantes, stagnantes ou tout simplement dans le désir de se développer, Armoni propose des solutions sur mesures grâce à des analyses expertes fondées sur des années de pratique.</p>
                            <p>Recrutement, formation, management, structuration, marketing, direction artistique, communication… Nombreux sont les points pouvant créer des situations bloquantes diminuant la rentabilité d'une affaire.</p>
                            <p>Pouvoir les débloquer efficacement est la mission que nous nous fixons. Identifier les problématiques, est plus utile encore si on a la capacité de les traiter…</p>
                            <p>Pour s'en donner les moyens Armoni solutions s'appuie donc sur un important réseau professionnel dû à de nombreuses années de terrain.</p>
                            <p>Une clientèle à reconquérir ? Une activité à lancer ou relancer ? Une équipe à constituer, à former ? une ouverture à organiser, un projet à développer ?</p>
                            <p>Notre réseau est constitué de professionnels évalués par nos soins. En plus d'une expertise et d'un accompagnement, vous aurez donc aussi la possibilité d'accéder à du personnel compétent et efficace, selon vos besoins.</p>
                            <p>La formation et le team building sont le prolongement de notre activité. Transmettre des valeurs tout en faisant monter en compétences. Guider vers la pleine maitrise de ses capacités.</p>
                            <p>Trouver et faire éclore les nouveaux talents. Produire du savoir-faire, du savoir-être mais aussi du savoir vendre.</p>
                            <p class="highlight-text">Au plaisir de vous compter parmi nos clients, partenaires ou collaborateurs.</p>
                        </div>
                    </div>
                </section>

                <!-- Fondateur -->
                <section id="fondateur" class="service-section">
                    <div class="service-header">
                        <div class="service-title-group">
                            <span class="service-icon"></span>
                            <h2>Fondateur</h2>
                        </div>
                    </div>
                    
                    <div class="fondateur-content">
                        <div class="fondateur-header">
                            <h3>Fondateur : Fabien Adamini</h3>
                        </div>
                        <div class="text-block">
                            <p class="highlight-text">TEXT EN ATTENTE</p>
                        </div>
                    </div>
                </section>

                <!-- Tarifs Section -->
                <div class="tarifs-content">
                    <!-- Section SALLE -->
                    <div class="tarif-section">
                        <div class="tarif-section-header">
                            <span class="tarif-section-icon"></span>
                            <h3 class="tarif-section-title">Salle Extra Staff</h3>
                        </div>
                        <div class="tarif-items">
                            <button class="tarif-item-btn" onclick="window.location.href='Formulaire/Salles/staff-service.php'">
                                <div class="tarif-service-info">
                                    <span class="tarif-service">Service</span>
                                    <span class="tarif-desc">Personnel en salle</span>
                                </div>
                                <div class="tarif-price-btn">
                                    <span class="tarif-prix">à partir de 30€/h</span>
                                    <span class="btn-arrow">→</span>
                                </div>
                            </button>

                            <button class="tarif-item-btn" onclick="window.location.href='Formulaire/Salles/staff-management.php'">
                                <div class="tarif-service-info">
                                    <span class="tarif-service">Management</span>
                                    <span class="tarif-desc">Encadrement d'équipe</span>
                                </div>
                                <div class="tarif-price-btn">
                                    <span class="tarif-prix">à partir de 40€/h</span>
                                    <span class="btn-arrow">→</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    <!-- Section CUISINE -->
                    <div class="tarif-section">
                        <div class="tarif-section-header">
                            <span class="tarif-section-icon"></span>
                            <h3 class="tarif-section-title">Cuisine</h3>
                        </div>
                        <div class="tarif-items">
                            <button class="tarif-item-btn" onclick="window.location.href='Formulaire/cuisine/staff-Pizzaiolo.php'">
                                <div class="tarif-service-info">
                                    <span class="tarif-service">Pizzaiolo</span>
                                    <span class="tarif-desc">Spécialiste pizza</span>
                                </div>
                                <div class="tarif-price-btn">
                                    <span class="tarif-prix">à partir de 30€/h</span>
                                    <span class="btn-arrow">→</span>
                                </div>
                            </button>

                            <button class="tarif-item-btn" onclick="window.location.href='Formulaire/cuisine/staff-Production.php'">
                                <div class="tarif-service-info">
                                    <span class="tarif-service">Production & Service cuisine</span>
                                    <span class="tarif-desc">Cuisine générale</span>
                                </div>
                                <div class="tarif-price-btn">
                                    <span class="tarif-prix">à partir de 25€/h</span>
                                    <span class="btn-arrow">→</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sidebar Menu Droit - VIDE -->
            <aside class="sidebar right-sidebar">
                <!-- Sidebar droite vide -->
            </aside>
        </div>
    </div>


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
                    <li><a href="#">Cookies</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2025 Armoni Solution. Tous droits réservés.</p>
        </div>
    </div>
</footer>


<script src="js/script.js"></script>
 </body>
</html>
