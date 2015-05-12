<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->

<html>
    <head><?php 
// Inialize session
if(!isset($_SESSION)) {
     session_start();
     $_SESSION['kysenum'] = 0;
     $_SESSION['pisteet'] = 0;
     $_SESSION['user'] = "";
     $_SESSION['id']="";
     $_SESSION['kysejar']=array(array());
     $_SESSION['catego']=0;
     $_SESSION['vastattu']=1;
     $_SESSION['kyspercat']=5;
}
  ?>
        <meta charset="UTF-8">
        <title>Testikysely</title>
         <script src="./jquery-2.1.3.min.js"> </script>
        <script src="./index.js"> </script>
        <link href="amaz.css" rel="stylesheet" type="text/css"/>
    </head>
    <body>
        
        <button id="meemies">ALOITA TESTI</button>
        <div id="vastaus"></div>
        <button id="cat-button">aloita</button><button id="joniboi">Vaihda tunnus</button><button id="sub-button">subscribe</button><button id="report-button">report</button>
        <div id="meemi"></div>
    </body>
</html>
