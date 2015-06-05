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
     $_SESSION['kysenum'] = 0; 	//nykyinen kysymys
     $_SESSION['user'] = ""; 	//käyttäjän nimi id
     $_SESSION['id']="";		//kyselyn id
     $_SESSION['kysejar']=array(array());	//järjestys, jossa kysymykset kysytään
     $_SESSION['catego']=0;					//nykyinen kategoria
     $_SESSION['cat_varasto']=array();		//varasto valituista kategorioista
     $_SESSION['vastattu']=1;				//vastattujen kysymysten määrä
     $_SESSION['kyspercat']=5;				//kysymysten määrä per kategoria
}
  ?>
        <meta charset="UTF-8">
        <title>Testikysely</title>
         <script src="./jquery-2.1.3.min.js"> </script>
        <script src="./index.js"> </script>
        <link href="amaz.css" rel="stylesheet" type="text/css"/>
    </head>
    <body>
        <img src="./esedu.png" class="logo"/>
        <h1 class="title">Osaamiskartoitustesti</h1>
        <div class="inbox">
            <button id="meemies">ALOITA TESTI</button>
        
        <div id="vastaus"></div>
        <button id="cat-button">Aloita</button>
        <button id="joniboi">Vaihda tunnus</button>
        <button id="sub-button">Seuraava kysymys</button>
        <button id="report-button">Edellinen kysymys</button>
        <button id="demo-button">Aloita demotesti</button>
        <div id="meemi"></div>
        </div>
    </body>
</html>
