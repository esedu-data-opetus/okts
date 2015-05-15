<?php
    include ('./conn/dbconnect.php');
?>
<link href="kyspanel.css" rel="stylesheet" type="text/css"/>
<script src="jquery-2.1.3.min.js" type="text/javascript"></script>
<script src="kyspanel.js" type="text/javascript"></script>
<select name="kategoria" id="alleycatblues">
    <option value=""> </option>
    <?php
        $query = $dbcon->query("SELECT * FROM kategoriat");
        	while($row = $query->fetch_object()){
                   echo "<option value='".$row->catid."'>".$row->catname."</option>";
                }
    ?>  
</select> <div id="qweww"></div><div id="ewqewq"></div>

<div id="asdid"></div>