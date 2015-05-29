<?php
if(!isset($_SESSION)) {
     session_start();
}
if (isset($_SESSION['username'])) {
header('Location: index.php');
}
if (isset($_SESSION['error'])) {
	switch($_SESSION['error']) { 
		case "usrname" : 
			echo "Käyttäjänimi tai salasana väärin";
			break;
		case "passwd" :
			echo "Käyttäjänimi tai salasana väärin";
			break;
	}
}
?>

<form action="joo.php" method="post">
	Nimi: <br><input type="text" name="nimi" required /><br>
	Salasana: <br><input type="password" name="pwd" required /><br>
	<input type="submit" value="Kirjaudu sisään">
</form>