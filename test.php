
<?php

include('./conn/dbconnect.php');	
if(!isset($_SESSION)) {
     session_start();
}


if (is_ajax()) {
  if (isset($_POST["action"]) && !empty($_POST["action"])) { //Checks if action value exists
    $action = $_POST["action"];
    
    switch($action) { //Switch case for value of action
        case "kategoriat": hae_kategoria();break;
        case "seuraavakys": tall_vast();
            $_SESSION['kysenum']++;$_SESSION['vastattu']++;
            hae_kysymys(); break;
        case "ekakys" : $_SESSION['kysenum']++;hae_kysymys();break;
        case "viimekys": 
            tall_vast();
            if($_SESSION['kysenum']>1){$_SESSION['kysenum']--;}
            if($_SESSION['vastattu']>1){$_SESSION['vastattu']--;}
            hae_kysymys(); break;
        case "aloita":luotesti();break;
        case "vaihdatunus": vaihda_tunnus(); break;
        case "haecat_pan": hae_kategoria_paneeli(); break;
        case "bennys": muuta_demo(); break;
        case "tallinna": muutakys(); break;
        case "ses": ses_function(); break;
        case "drag": drag_function(); break;
    }
  }
}

//Function to check if the request is an AJAX request
function is_ajax() {
  return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
}

function muutakys(){
    global $dbcon;
    $return = $_POST;
    
    
    $sql = 'UPDATE kysymys SET titleq="'.$return["titleq"].'" WHERE  id='.$return['id'];
    if ($dbcon->query($sql) === TRUE) {
} else {
    $return['err']= "Error: " . $sql . $dbcon->error;
}    

    
    for($i=1;$i<5;$i++){
    $sql = 'UPDATE vastasukset SET ans="'.$return["answer".$i].'" WHERE  ansid='.$return['ansid'.$i];
    if ($dbcon->query($sql) === TRUE) {
        } else {
            $return['err']= "Error: " . $sql . $dbcon->error;
        }   
    }
    
 $query = "SELECT * FROM kysymys where id='".$return['id']."'";
 $result = $dbcon->query($query);
    while($row = $result->fetch_array()){
        
    $return['r1']=$return['titleq'];
    $return['r2']=$return['answer1'];
    $return['r3']=$return['answer2'];
    $return['r4']=$return['answer3'];
    $return['r5']=$return['answer4'];
    }
    
    echo html_entity_decode(json_encode($return));
}

function hae_kategoria_paneeli(){
    //hakee kysymyspaneeliin annetusta kategoriasta kaikki kysymykset
    global $dbcon;
    $return = $_POST;
    
    //haetaan kysymykset arrayhyn
    $query = "select * from kysymys where category = ".$return['kategoria'];
    $result = $dbcon->query($query);
    while($row = $result->fetch_array()){
        $temparray[] = $row;
    }
    
    //koska kysymystietokannassa vastaukset ovat viittauksia toiseen tietokantaan
    //pitää vastaukset hakea uudella kyselyllä jokaiselle kysymykselle.
    foreach($temparray as &$temp){
        for ($i=1;$i<5;$i++){
            $str = "answer".$i;
            $temp['ansid'.$i]=$temp[$str];
            //pitää kysymyksen ID:n tallessa myöhempää muokkausta varten
            $query = "SELECT * FROM vastasukset where ansid='".$temp[$str]."'";
            $result2 = $dbcon->query($query);
            while($row = $result2->fetch_array()){
                $temp[$str]=$row['ans'];
            }
        }
    }
    
    //palautetaan json selaimelle
    $return['catarray']=$temparray;
    echo html_entity_decode(json_encode($return));
}

function hae_kategoria(){
    
    global $dbcon;
    $return = $_POST;
    $query = "select * from kategoriat";
    
    $result = $dbcon->query($query);
    
while($row = $result->fetch_array())
{$rows[] = $row;}
$i = 0;
$temparray = array("id"=>array(),"name"=>array());
  
foreach($rows as $row)
    
{$temparray['id'][$i]=$row['catid'];$temparray['name'][$i]=$row['catname'];$i++;}
//$temparray['name'] = array_map('utf8_encode',$temparray['name']);
$return['catarray'] = $temparray;
$return['catmaara'] = $i;
echo html_entity_decode(json_encode($return));

}

function luotesti(){
    //luo testin tietokantaan
    
    global $dbcon;
    $return = $_POST;
    $o = 0;
    $temparray= array();
    
    if ($return['test_preset']!=0){
        $query = "select * from testipohjat where pohjaid = ".$return['test_preset'];
        $result = $dbcon->query($query);        
        while($row = $result->fetch_array()) { 
            for($i=1;$i<6;$i++){
                $str = "cat".$i;
                $temparray[]=$row[$str];
            }
        }
    } else {
        $temparray=$return['kategoria'];
    }
    
    foreach($temparray as $cat){
        if (!isset($catname)){
            $catname ="";
        }
        
        $query = "select * from kategoriat where catid = ".$cat;
        $result = $dbcon->query($query);        
        while($row = $result->fetch_array()) {
            $catname= $row['catname'];
        }

        $query = "select * from kysymys where category = ".$cat." and demokys = 1 limit ".$_SESSION['kyspercat'];
        $result = $dbcon->query($query);
        $rows='';
        while($row = $result->fetch_array()) {
            $rows[] = $row;
        }
        
        $i = 1; 
        foreach($rows as $row) {
            $_SESSION['kysejar'][$o][$i] = $row['id'];
            $i++;
        }
        
        $_SESSION['kysejar'][$o][$i] = -1;$i++;
        $_SESSION['kysejar'][$o][$i] = $catname;
        $o++;
    }

    $_SESSION['kysejar'][] = -1;
    
    $temp_id = uniqid();
    $_SESSION['user'] = "guest".$temp_id;
    $sql = "INSERT INTO `testit` (`usr`, `testipohja`) VALUES ('".$_SESSION['user']."','".$return['test_preset']."')";
    
    if ($dbcon->query($sql) === TRUE) {} 
    else {
        echo "Error: " . $sql . "<br>" . $dbcon->error;
    }
    $res = "SELECT * FROM testit where usr = '".$_SESSION['user']."'";

    $result = mysqli_query($dbcon,$res) or die(mysqli_errno($dbcon));
    while($row = $result->fetch_assoc()) {
        $_SESSION['testid']=$row['testid'];
    }    
         
    //jostain syystä utf8_encode palauttaa huonoja kirjaimia
    $return['catname']=  utf8_encode($_SESSION['kysejar'][(int)$_SESSION['catego']][$_SESSION['kyspercat']+2]);
    //$return['catname']=  $_SESSION['kysejar'][(int)$_SESSION['catego']][$_SESSION['kyspercat']+2];

    echo html_entity_decode(json_encode($return));    
}

function tall_vast(){
    $return = $_POST;
    if ($return['value']!= null){
        global $dbcon;
            
        $sesos = "kys".$_SESSION['vastattu'];
        $soses = "ans".$_SESSION['vastattu'];
        //päivittää tietokantaan käyttäjän vastauksen
        $sql = "UPDATE testit SET ".$sesos." = ".$return["kysid"].
                ", ".$soses." = ".$return["value"].
                " where testid = ".$_SESSION['testid'];
        if ($dbcon->query($sql) === TRUE) {} else {
            echo "Error: " . $sql . "<br>" . $dbcon->error;
        }
    }    

}





function hae_kysymys(){
    $return = $_POST;
    global $dbcon;
    $return['catval']="";
    $return["kysenum"]=$_SESSION['kysenum'];
    
    if($_SESSION['kysejar'][(int)$_SESSION['catego']][(int)$_SESSION['kysenum']] > 0){
        //tarkistetaan että seuraava kysymys on kysymys ja
        //haetaan kysymys tietokannasta
        $query = "SELECT * FROM kysymys kys " .
                 "JOIN vastasukset vas ON kys.answer1=vas.ansid and id = ".
                 $_SESSION['kysejar'][(int)$_SESSION['catego']][(int)$_SESSION['kysenum']];
        $result = mysqli_query($dbcon,$query) or die(mysqli_errno($dbcon));
        while($row = $result->fetch_assoc()) {
            $return["q_id"]= $row['id'];
            $return["ans1"]=$row['ans'];
            $return["kysymys"]=$row['titleq'];
            $return["kuve"]=$row['image'];
        }
        //haetaan kaikki vastaukset erikseen
        //vois kai olla parempikin ratkaisu mut tää toimii
        $query = "SELECT * FROM kysymys kys
                 JOIN vastasukset vas ON kys.answer2=vas.ansid and id = ".
                 $_SESSION['kysejar'][(int)$_SESSION['catego']][(int)$_SESSION['kysenum']];

        $result2 = mysqli_query($dbcon,$query) or die(mysqli_errno($dbcon));
        while($row = $result2->fetch_assoc()) {
            $return["ans2"]=$row['ans'];
        }
        
        $query = "SELECT * FROM kysymys kys
                JOIN vastasukset vas ON kys.answer3=vas.ansid and id = ".
                $_SESSION['kysejar'][(int)$_SESSION['catego']][(int)$_SESSION['kysenum']];

        $result3 = mysqli_query($dbcon,$query) or die(mysqli_errno($dbcon));
        while($row = $result3->fetch_assoc()) {
            $return["ans3"]=$row['ans'];
        }
        
        $query = "SELECT * FROM kysymys kys
                JOIN vastasukset vas ON kys.answer4=vas.ansid and id = ".
                $_SESSION['kysejar'][(int)$_SESSION['catego']][(int)$_SESSION['kysenum']];

        $result4 = mysqli_query($dbcon,$query) or die(mysqli_errno($dbcon));
        while($row = $result4->fetch_assoc()) {
            $return["ans4"]=$row['ans'];
        }
        
        //jos testissä mentiin taaksepäin, haetaan aiempi vastaus
        $sesos = "ans".$_SESSION['vastattu'];
        $sql = "select * from testit where testid = ".$_SESSION['testid'];
        $result = mysqli_query($dbcon,$sql) or die(mysqli_errno($dbcon));
        
        while($row = $result->fetch_assoc()) {
            $asd10="rad".$row[$sesos];
            if($asd10!="rad0"){
                $return['prevans']=$asd10;
            }
        }
        
        echo html_entity_decode(json_encode($return));
        return;
    }

    $_SESSION['catego']++;
    $_SESSION['kysenum']=0;


    if (!is_array($_SESSION['kysejar'][(int)$_SESSION['catego']])){
        //jos kategoria ei ole array, on testissä päästy loppuun joten lasketaan pisteet
        $tempvar = $_SESSION['vastattu'] - 1;
        $tempvar2 = 1;
        $pistevar = 0;
        //tallennetaan testin lopetusaika
        $sql = "UPDATE testit SET vastattu = '".$tempvar ."',finnish = now() where testid = ".$_SESSION['testid'];
        if ($dbcon->query($sql) === TRUE) {}
        for ($i = $tempvar; $i>0 ;$i--){
            $sesos = "kys".$tempvar2;
            $soses = "ans".$tempvar2;
            $tempvar2++;
            
            //tarkistetaan vastaukset testihistoriasta
            $sql = "SELECT * FROM testit tes
            JOIN kysymys kys ON tes.".$sesos."=kys.id and tes.".$soses."=kys.oikeavastaus
            where usr = '".$_SESSION['user']."';";
            
            $result = mysqli_query($dbcon,$sql) or die(mysqli_errno($dbcon));
            if(mysqli_num_rows($result) > 0){$pistevar++;}
        }

        $return["loppu"]="end";
        $return['usr']=$_SESSION['user'];
        $return["kysenum"]=$_SESSION['kysenum'];
        $return["log2"]=$pistevar;
        //lasketaan ja tallennetaan testiin käytetty aika
        $sql = "update testit set aika = TIMESTAMPDIFF(second,testit.start,testit.finnish) "
                . "where testit.testid = ".$_SESSION['testid'];
        if ($dbcon->query($sql) === TRUE) {} 
    } 

    else {$return['catval']="joo";
    //näytetään seuraava kategoria
        $return['catname']=$_SESSION['kysejar'][(int)$_SESSION['catego']][$_SESSION['kyspercat']+2];
    }

echo html_entity_decode(json_encode($return));
}

  
  function vaihda_tunnus(){
      global $dbcon;
      $return = $_POST;
       $sql = "UPDATE testit SET usr = '".$return['value']."' where testid = ".$_SESSION['testid'];
    if ($dbcon->query($sql) === TRUE) {$return['usr']=$return['value'];$return['vaihto']=1;
} else {
    $return['error']='SQL-pyyntö epäonnistui';
}    
$return['loppu']='end';
echo html_entity_decode(json_encode($return));
  }
  
  
  function muuta_demo(){
      global $dbcon;
      $return = $_POST;
      
      $sql = "UPDATE kysymys SET demokys = '".$return['value']."' where id ='".$return['id']."'";
    if ($dbcon->query($sql) === TRUE) {$return['joo'] = 'Tietokanta päivitetty';
} else {
    $return['joo'] = "Error: " . $sql . "<br>" . $dbcon->error;
}   

echo html_entity_decode(json_encode($return));
  }
  
  
  

function drag_function(){
$return = $_POST;

$oike1 = "drag4"; // TÄS PITÄÄ TIETÄÄ :D
$oike2 = "drag5"; // TÄS PITÄÄ TIETÄÄ :D
$oike3 = "drag6"; // TÄS PITÄÄ TIETÄÄ :D
$oike4 = "drag1"; // TÄS PITÄÄ TIETÄÄ :D

if($return["dz1"]==$oike1)
{    $return["kys1"]='oekkee';    }
else
{ $return["kys1"]='viäri';}

if($return["dz2"]==$oike2)
{    $return["kys2"]='oekkee';    }
else
{ $return["kys2"]='viäri';}

if($return["dz3"]==$oike3)
{    $return["kys3"]='oekkee';    }
else
{ $return["kys3"]='viäri';}

if($return["dz4"]==$oike4)
{    $return["kys4"]='oekkee';    }
else
{ $return["kys4"]='viäri';}


 $return["json"] = json_encode($return);
 echo json_encode($return);
}

function ses_function(){
    $return = $_POST;
    
    $return["kyse"]="KRIPP DAY9 TRUMP REYNAD";
    $return["kuve1"]="ytfh-Bad.png";
    $return["kuve2"]="photo.jpg";
    $return["kuve3"]="4-0SEN.jpg";
    $return["kuve4"]="hearthstone-q-and-a-kripparrian.jpg";
    $return["kuve5"]="1h31x.jpg";
    $return["kuve6"]="28443-1413637422.jpg";
    $return["kuve7"]="_ppmceow_400x400.jpeg";
    $return["kuve8"]="maxresdefault.jpg";
    
echo html_entity_decode(json_encode($return));
}
?>