<?php
//dbconnect :D

define('HOST','localhost');
define('USER','root');
define('PASS','');
define('DBNAME','amaz');

// yritetään yhdistää sql
$dbcon= mysqli_connect(HOST,USER,PASS,DBNAME);

if (mysqli_connect_errno())	{echo "Yhteys tietokantaan ei onnistu.<br>";}
// else 					{*/echo "Yhteys tietokantaan muodostettu.<br>";}

?>