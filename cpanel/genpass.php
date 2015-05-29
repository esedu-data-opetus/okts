<?php
if (isset($_POST['nimi'])){
	
	if ($_POST['pwd'] == $_POST['repwd']){
			
		$nimi=$_POST['nimi'];
		$pwd=$_POST['pwd'];
		
		include_once('../conn/dbconnect.php');	
		include_once('./PasswordHash.php');
		
		
		$nimi = stripslashes($nimi);
		$pwd = stripslashes($pwd);
		$nimi = mysqli_real_escape_string($dbcon,$nimi);
		$pwd = mysqli_real_escape_string($dbcon,$pwd);
		
		$pwd = create_hash($pwd);

		$query = $dbcon->query("INSERT INTO kayttajat (usrname,salasana) VALUES('$nimi','$pwd');");
	}
}
		
?>

 <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
 	Nimi: <br><input type="text" name="nimi" required /><br>
	Salasana: <br><input type="password" name="pwd" required /><br>
	Salasana uudelleen: <br><input type="password" name="repwd" required /><br>
	<input type="submit" value="Kirjaudu sisään">
</form>