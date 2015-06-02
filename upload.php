<?php


$allowedExts = array("gif", "jpeg", "jpg", "png");
$temp = explode(".", $_FILES["file"]["name"]);
$extension = end($temp);

if ($_FILES["file"]["size"] < 2000000
&& in_array($extension, $allowedExts)) {
    if ($_FILES["file"]["error"] > 0) {
        $return['err'] = "Return Code: " . $_FILES["file"]["error"] . "<br>";
    } else {
        $filename = uniqid().".".$extension;
        $return['fname'] = $filename;
        $return['ftype'] = $_FILES["file"]["type"];
        $return['fsize'] = ($_FILES["file"]["size"] / 1024);

        while (file_exists("img/" . $filename)) {
            $filename = uniqid().".".$extension;
			$return['fname'] = $filename;
        } 
        
		move_uploaded_file($_FILES["file"]["tmp_name"],
        "./img/" . $filename);
        $return['success'] = "success";
		include_once('./conn/dbconnect.php');
        
    }
} else {
    $return['err'] =  "Tiedosto ei kelpaa";
}
echo html_entity_decode(json_encode($return));
?>