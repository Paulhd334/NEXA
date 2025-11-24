<?php
// config/process_form.php
require_once __DIR__ . '/config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Nettoyer et valider les données
    $name = htmlspecialchars(trim($_POST['name']));
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $phone = htmlspecialchars(trim($_POST['phone']));
    $service = htmlspecialchars(trim($_POST['service']));
    $message = htmlspecialchars(trim($_POST['message']));
    
    // Validation
    if (empty($name) || empty($email) || empty($service) || empty($message)) {
        header("Location: ../contact/erreur.php?error=champs_manquants");
        exit();
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        header("Location: ../contact/erreur.php?error=email_invalide");
        exit();
    }
    
    try {
        // Insertion dans la base MySQL
        $stmt = $pdo->prepare("INSERT INTO contacts (name, email, phone, service, message) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$name, $email, $phone, $service, $message]);
        
        // Redirection vers la page de remerciement
        header("Location: ../contact/merci.php");
        exit();
        
    } catch(PDOException $e) {
        error_log("Erreur BDD: " . $e->getMessage());
        header("Location: ../contact/erreur.php?error=technique");
        exit();
    }
} else {
    header("Location: ../index.php");
    exit();
}
?>