<?php

//sallitaan vain kuvatiedostot
$allowedExts = array("gif", "jpeg", "jpg", "png");
$temp = explode(".", $_FILES["file"]["name"]);
//otetaan kuvan tiedostopääte
$extension = end($temp);

//tarkistetaan että kuvan tiedostopääte täsmää sallittuihin tiedostopäätteisiin
//eikä tiedosto ole liian iso
if ($_FILES["file"]["size"] < 2000000
&& in_array($extension, $allowedExts)) {
	//palautetaan virhe, jos sellainen on
    if ($_FILES["file"]["error"] > 0) {
        $return['err'] = "Return Code: " . $_FILES["file"]["error"] . "<br>";
    } else {
		//luodaan tiedostolle uniikki tiedostonnimi
        $filename = uniqid().".".$extension;
        $return['fname'] = $filename;
        $return['ftype'] = $_FILES["file"]["type"];
        $return['fsize'] = ($_FILES["file"]["size"] / 1024);
		
		//jos samanniminen tiedosto on olemassa, luodaan uusi nimi
        while (file_exists("img/" . $filename)) {
            $filename = uniqid().".".$extension;
			$return['fname'] = $filename;
        } 
        
		//tallennetaan ladattu kuva
		move_uploaded_file($_FILES["file"]["tmp_name"], "./img/" . $filename);
        $return['success'] = "success";
        
    }
} else {
	//jos kuva on liian iso tai tiedostopääte on väärä, palautetaa virhe
    $return['err'] =  "Tiedosto ei kelpaa";
}
echo html_entity_decode(json_encode($return));


?>