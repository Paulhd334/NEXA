<?php
// config/config.php
$host = 'localhost';
$dbname = 'armonitsolution';
$username = 'armonitsolution';
$password = 'xdmkoz789eezS8ajshucS78';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Erreur de connexion: " . $e->getMessage());
}
?>