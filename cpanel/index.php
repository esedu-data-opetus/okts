<?php

// Inialize session
if(!isset($_SESSION)) {
     session_start();
}
// Check, if username session is NOT set then this page will jump to login page
if (!isset($_SESSION['username'])) {
header('Location: login.php');
}



?>

<a href="./logout.php"> Kirjaudu ulos </a><br>
<a href="./PANEELI.php"> Lisää kysymys </a><br>
<a href="./kyspanel.php"> Selaa ja muokkaa kysymyksiä </a>