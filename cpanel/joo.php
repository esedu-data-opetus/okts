<?php
if(!isset($_SESSION)) {
     session_start();
}
if (isset($_SESSION['username'])) {
header('Location: index.php');
}

if( isset($_POST['nimi'])&&!empty($_POST['nimi'])&&
	isset($_POST['pwd'])&&!empty($_POST['pwd'])){
		
	$nimi=$_POST['nimi'];
	$pwd=$_POST['pwd'];

	include_once('../conn/dbconnect.php');
	// To protect MySQL injection (more detail about MySQL injection)
	$nimi = stripslashes($nimi);
	$pwd = stripslashes($pwd);
	$nimi = mysqli_real_escape_string($dbcon,$nimi);
	$pwd = mysqli_real_escape_string($dbcon,$pwd);


	include('./PasswordHash.php');
	//validate_password($pwd,$pwdh);


	$query  = "SELECT * FROM kayttajat WHERE usrname = '$nimi' LIMIT 1";
	$result = mysqli_query($dbcon,$query) or die(mysqli_errno($dbcon));
	if ($result->num_rows>0)
	{
		while($row = $result->fetch_assoc()) {
			if(validate_password($pwd, $row['salasana']))
				{
					echo $_SESSION['username'];
					// Set username session variable
					$_SESSION['username'] = $_POST['nimi'];
					$_SESSION['userid'] = $row['usrid'];
					header('Location: index.php');
				}
			else 
				{
					$_SESSION['error']="passwd";
					header('Location: login.php');
				}
		}
	}
	else {$_SESSION['error']="usrname"; header('Location: login.php');}
}
?>