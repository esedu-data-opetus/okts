<?php
include 'dbconnect.php';  


$kysymys ="";
$ansid1 ="";
$ansid2 ="";
$ansid3 ="";
$ansid4 ="";
$value ="";
$kategoria ="";
$basename1 ="";

$kyserr = "";
$ans1err = "";
$ans2err = "";
$ans3err = "";
$ans4err = "";
$valueerr = "";
$katerr = "";

        if(isset($_POST['submit'])){
            
        if(empty($_POST['kysymys'])){
            $kyserr = "Sinulta puuttuu kysymys!";
              } else {
               $kysymys = $_POST['kysymys'];   
               $kysymys = $dbcon->real_escape_string($kysymys);
               $kysymys = htmlspecialchars($kysymys, ENT_QUOTES, "UTF-8");
              }
        
              if(empty($_POST['ans1'])){
            $ans1err = "Sinulta puuttuu vastaus!";
              } else {
               $answer1 = $_POST['ans1'];       
               $answer1 = $dbcon->real_escape_string($answer1);
               $answer1 = htmlspecialchars($answer1, ENT_QUOTES, "UTF-8");
              }
              
              if(empty($_POST['ans2'])){
            $ans2err = "Sinulta puuttuu vastaus!";
              } else {
               $answer2 = $_POST['ans2'];       
               $answer2 = $dbcon->real_escape_string($answer2);
               $answer2 = htmlspecialchars($answer2, ENT_QUOTES, "UTF-8");
              }
        
        
              if(empty($_POST['ans3'])){
            $ans3err = "Sinulta puuttuu vastaus!";
              } else {
               $answer3 = $_POST['ans3'];     
               $answer3 = $dbcon->real_escape_string($answer3);
                $answer3 = htmlspecialchars($answer3, ENT_QUOTES, "UTF-8");
              }
        
        
              if(empty($_POST['ans4'])){
            $ans4err = "Sinulta puuttuu vastaus!";
              } else {
               $answer4 = $_POST['ans4'];       
               $answer4 = $dbcon->real_escape_string($answer4);
               $answer4 = htmlspecialchars($answer4, ENT_QUOTES, "UTF-8");
              }       
        
             if(empty($_POST["value"])){
            $valueerr = "- Sinulta puuttuu oikea vastaus!";
              } else {
        $value = $_POST["value"];
              }
              
              
         if(empty($_POST["kategoria"])){
            $katerr = "Sinulta puuttuu kategoria!";
              } else {
        $kategoria = $_POST["kategoria"];
              }
        
        
        
        
        
        
       
        
   
       
        

if(isset($_FILES['upload']['name']))
	{

 if(!$_FILES['upload']['error'])
    {

$new_file_name = strtolower($_FILES['upload']['tmp_name']); //rename file
        $image_type = $_FILES['upload']['type'];
        $basename0 = "." . basename ($image_type);
        $basename1 = basename($new_file_name) .$basename0;


        $qwdf = $_FILES['upload']['tmp_name'];
                    move_uploaded_file($qwdf, $basename1);
                    $message = 'Your file was accepted.';
            echo $basename1 , " " , $basename0;
    
    }
   
        }
       

        
        
  if($kysymys && $value){
$ansid1="";
$ansid2="";
$ansid3="";
$ansid4="";
        $query = $dbcon->query("INSERT INTO vastasukset (ans) VALUES('$answer1'),('$answer2'),('$answer3'),('$answer4');");
            if($query){
        $query = "SELECT * FROM vastasukset where ans = '".$answer1."'";
      $result = mysqli_query($dbcon,$query) or die(mysqli_errno($dbcon));
  		while($row = $result->fetch_assoc())
         {$ansid1 = $row['ansid'];}
        $query = "SELECT * FROM vastasukset where ans = '".$answer2."'";
      $result = mysqli_query($dbcon,$query) or die(mysqli_errno($dbcon));
  		while($row = $result->fetch_assoc())
         {$ansid2 = $row['ansid'];}
        $query = "SELECT * FROM vastasukset where ans = '".$answer3."'";
      $result = mysqli_query($dbcon,$query) or die(mysqli_errno($dbcon));
  		while($row = $result->fetch_assoc())
         {$ansid3 = $row['ansid'];}
        $query = "SELECT * FROM vastasukset where ans = '".$answer4."'";
      $result = mysqli_query($dbcon,$query) or die(mysqli_errno($dbcon));
  		while($row = $result->fetch_assoc())
         {$ansid4 = $row['ansid'];}
            }
            else{
         echo $dbcon->errno;
    }
    }$query = $dbcon->query("INSERT INTO kysymys (titleq,answer1, answer2, answer3,answer4, oikeavastaus, category, image) VALUES('$kysymys','$ansid1','$ansid2','$ansid3','$ansid4', '$value', '$kategoria', '$basename1')");
    if($query){echo "ebin :D";}
    else{
         echo "<br>Kyselyä ei onnistettu siirtämään tietokantaan. <br> <br>";
    }
}
        
?>

<!DOCTYPE html>
<!--

-->
<html>
    <head>
        <meta charset="UTF-8">
        <title>Paneeli</title>
    </head>
    <body>
             
            <script src="jquery-2.1.3.js" type="text/javascript"></script>
        
        <link href="amaz.css" rel="stylesheet" type="text/css"/>
        
        <div id="panel">
       
 <form enctype="multipart/form-data" method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
              
Kysymys:<input type="text" name="kysymys"> 
<br> <div id="err"> <?php echo $kyserr; ?> </div> <br>
Vastaukset <div id="err"> <?php echo $valueerr; ?> </div>  <br><br>
Vastaus1: <input type="text" name="ans1"><input type="radio" name="value" value="1" id="1"><label for="1" value="1">Oikea vastaus</label>
<br> <div id="err"> <?php echo $ans1err; ?> <br> </div>
Vastaus2: <input type="text" name="ans2"><input type="radio" name="value" value="2" id="2"><label for="2" value="2">Oikea vastaus</label>
<br> <div id="err"> <?php echo $ans2err; ?> </div> <br>
Vastaus3: <input type="text" name="ans3"><input type="radio" name="value" value="3" id="3"><label for="3" value="3">Oikea vastaus</label>
<br> <div id="err"> <?php echo $ans3err; ?> </div> <br>
Vastaus4: <input type="text" name="ans4"><input type="radio" name="value" value="4" id="4"><label for="4" value="4">Oikea vastaus</label>
<br> <div id="err"> <?php echo $ans4err; ?> </div> <br> 

<select name="kategoria">
    <?php
        $query = $dbcon->query("SELECT * FROM kategoriat");
        	while($row = $query->fetch_object()){
		echo "<option value='".$row->catid."'>".$row->catname."</option>";
                }
    ?>  
</select> <div id="err"> <?php echo $katerr; ?> </div> <br> <br>
    <label for="image">Kuva:</label>
    <input type="file" name="upload"><br>
	<input type="submit" name="submit" value="Submit" />

</form>

        </div>
            
    </body>
</html>
