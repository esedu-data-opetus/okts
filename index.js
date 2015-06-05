
$( document ).ready(function() {
    
	//url ajax-pyynnöille
    var php_url = "./test.php";
    
	//piilotetaan toistaiseksi turhat näppäimet
    console.log( "ready!" );
    $('#sub-button').hide();
    $('#report-button').hide();
    $('#joniboi').hide();
    $('#cat-button').hide();
    $('#meemies').hide();
	
	//haetaan kategoriat harjoitustestiä varten
	/*
    var tempvar = {"action": "kategoriat"};
    tempvar = $(this).serialize() + "&" + $.param(tempvar);
    $.ajax({
        method: "POST",
        dataType: "json",
        data:tempvar,
        url: php_url,
        cache: false,
        success:function( data ) {
			//kaikki html-koodi laitetaan ensin arrayyn
            var array = [];
            array.push('<div id="checkboxdiv">');
            for(var i = 0; i<data['catmaara'];i++){
                array.push('<input type="checkbox" name="kategoria" value="'+data['catarray']['id'][i]+'">'+data['catarray']['name'][i]+'</input><br>');
            }
            array.push('</div>');
			//jonka jälkeen array kirjoitetaan diviin
			//array.join() liittää kaikki arrayn arvot yhteen ja kirjoittaa jokaisen arvon väliin sulkeiden sisällä olevan merkkijonon
            $("#vastaus").append(array.join(''));
            $('#vastaus').prepend('<span class="err">Valitse kategoriat</span>');
        }
    });
	*/
	
    var data= "";
    var kysid;
    
	//aloitetaan harjoitustesti
    $('#meemies').click(function() {  
        alku(1);
    });
    
	//aloitetaan demotesti
    $('#demo-button').click(function() {  
        alku(0);
    });

	//funktio testin aloittamiseen
    function alku(val){
		//testin aloitusfunktio php:llä aloittaa testin valituilla kategorioilla jos sille annetaan test_preset arvo 0
		//muuten funktio hakee tietokannasta testinpohjan jonka id on samna kuin test_presetin annettu arvo
        if (val===1){
            data={
                "action": "aloita",
                "kategoria": GetVal("kategoria"),
                "test_preset": 0
            };
        } else {
            data={
                "action": "aloita",
                "test_preset": 1
            };
        }
        data = $(this).serialize() + "&" + $.param(data);
        var ses = GetVal("kategoria");
		//jos valittiin kategoriat tai aloitettiin demotesti, lähetetään ajax-pyyntö joka hakee testin
        if(ses.length>0||val===0){
			$('#meemies').hide();
            $('#demo-button').hide();
            $('#cat-button').show();
            $.ajax({
                method: "POST",
                dataType: "json",
                data:data,
                url: php_url,
                cache: false,
                success:function( lod ) {
					//piilotetaan kategoriat ja näytetään ensimäinen kategoria
                    console.log(lod);
                    $('#checkboxdiv').hide();
                    $('#vastaus').html(lod['catname']);
                }
            });
        }
		//"valitse kategoriat" tekstistä punainen jos kategorioita ei valittu
        else {
            $('.err').css('color', 'red');
        }
    }

	//cat-button näkyy vain kategorian ensimmäisessä ruudussa, jossa on kategorian nimi
    $('#cat-button').click(function() {
        $('#cat-button').hide();
        $('#demo-button').hide();
        $('#sub-button').show();
        $('#report-button').show();
        data_json("ekakys");
        ajax_haekys(data);
    });    
    
	//sub-button etenee kyselyssä seuraavaan kysymykseen
    $('#sub-button').click(function() {
		//tarkistaa että kysymykseen on vastattu ennenkuin etenee kyselyssä
        var tempvar = $('input:radio[name=vast]:checked').val();
        if (typeof tempvar !== "undefined") {
            data_json("seuraavakys");
            ajax_haekys(data);
        };
    });

	//joniboi vaihtaa testihistoriasta kyselyn nimimerkin
    $('#joniboi').click(function() {
        if ($('#nick').val() !== ""){
            console.log($('#nick').val());
            data={
                "action": "vaihdatunus",
                "value":$('#nick').val()
                }; 
            data = $(this).serialize() + "&" + $.param(data);
            ajax_haekys(data);
        }
    });    

	//report-button menee kyselyssä taaksepäin
    $('#report-button').click(function() {
        data_json("viimekys");
        ajax_haekys(data);
    });

	//hakee täytettyjen checkboxien arvot arrayyn
    function GetVal(val) {
        var arr = new Array();
        $(':input[name="' + val + '"]').each(function () {
            if (this.checked) {
                arr.push($(this).attr('value'));
            }
        });
        return arr;
    }
	
	//funktio json datan täyttämiseen, hakee vastatun kysymyksen ja pitää kysymyksen id:n ajax-pyynnöissä mukana
    function data_json(action) {   
        data={
            "action": action,
            "value":$('input:radio[name=vast]:checked').val(),
            "kysid": kysid
        };
        data = $(this).serialize() + "&" + $.param(data);};

	//lähettää ajax-pyynnön annetulla json-objektilla, ja näyttää kysymyksen jonka palvelin palauttaa.
	//nöytttää myös seuraavan kategorian alun, edellisen kysymyksen, testin lopun ja nimimerkin vaihtamisen tilanteen mukaan
    function ajax_haekys(func_data){
        $.ajax({
            method: "POST",
            dataType: "json",
            data:func_data,
            url: php_url,
            cache: false,
            success:function( data ) {
				//data['loppu']==="end" kun testi loppuu, joten näytetään testin lopetusruutu
                if(data['loppu']==="end"){
					//data['vaihto']===1 jos käyttäjä on vaihtanut testin nimimerkin, joten näytetään että tunnuksen viahto onnistui
                    if(data['vaihto']===1){
						$('#vastaus').html('Tunnus vaihdettu onnistuneesti, testi tallennettu tunnuksella '+data['usr']+'<br>');
                    }
					//jos käyttäjä ei ole vaihtanut nimimerkkiä, niin testi on juuri loppunut
                    else {
						console.log(data['catpisteet'])
						//kirjoitetaan html-koodi ensin arrayyn, joka yhdistetään ja kirjoitetaan diviin.
						var array = [];
                        array.push('Testi loppui, sait '+data['log2']+' pistettä,');
						array.push('testi tallenettu vierastunnuksella '+data['usr']+'<br>');
						//data['aika'] on testiin käytetty aika sekunteina
						var min = data['aika']/60; // laskee minuutit
						var sek = data['aika']%60; // laskee jakojäännöksen minuuteista, eli ylijääneet sekunnit
						//math.floor pyöristää minuutit aina alaspäin
						array.push('Käytit testiin aikaa '+Math.floor(min)+' minuuttia ja '+sek+' sekuntia<br>');
						//näyttää pisteet kategorioittain
						$.each(data['catpisteet'], function(index,value){
							array.push('Sait '+value+' pistettä kategoriasta '+data['catnimet'][index]+'<br>');
						});
						$('#vastaus').html(array.join(''));
                    }

                    $('#vastaus').append('<input id="nick" type="text" />');
                    $('#joniboi').show();
                    $('#sub-button').hide();
                    $('#report-button').hide();
                    //return lopettaa nykyisen funktion, jolloin ei tuhlata aikaa testaillessa arvoja joita ei ole olemassa
					return;
                }
				//data['catval']==="joo" kun kyselyssä on päästy kategorian alkuun, joten näytetään kategorian nimi
				//ja näppäin jolla päästään kategorian kysymyksiin
                if(data['catval']==="joo"){
                    $('#report-button').hide();
                    $('#sub-button').hide();
                    $('#cat-button').show();
                    $('#vastaus').html(data['catname']);
                    return;
                }else{
					//jos ei olla kategorian alussa, ollaan kyselyssä, joten näytetään kysymys
                    var array = [];
					//data['kuve'] sisältää kysymykseen liitetyn kuvan nimen
					//jos kysymyksessä ei ole kuvaa, data['kuve'] on tyhjä
                    if (data["kuve"] !== ""){
                        array.push( '<div id="kuve"><img id="joo" src="./img/'+data["kuve"]+'"></img></div>');
                    };
					
                    array.push('<div id="kyse">');
                    array.push(data["kysymys"]+'<br>');
                    array.push('<input id="rad1" name="vast" type=radio value="1"  />'+data["ans1"]+'<br>');
                    array.push('<input id="rad2" name="vast" type=radio value="2"/>'+data["ans2"]+'<br>');
                    array.push('<input id="rad3" name="vast" type=radio value="3"/>'+data["ans3"]+'<br>');
                    array.push('<input id="rad4" name="vast" type=radio value="4"/>'+data["ans4"]+'<br>');
                    
                    //Kappa
                    if (    data["kysymys"]==="Kappa"&&
                            data["ans1"]==="Kappa"&&
                            data["ans2"]==="Kappa"&&
                            data["ans3"]==="Kappa"&&
                            data["ans4"]==="Kappa"  ) {
                            array.push('<input id="rad5" name="vast" type=radio value="5"/>Kappa<br></div>');
                            array.push('<iframe style="display:none;" src="https://www.youtube.com/embed/XpTZlXn3pxY?autoplay=1" frameborder="0"></iframe>');
                        }
                    //Kappa
                    
                    else{
                        array.push('<input id="rad5" name="vast" type=radio value="5"/>En halua vastata<br></div>');
                    }
                    $("#vastaus").html(array.join(''));
					
					//pidetään kysymysten id tallessa ja ajan tasalla
                    kysid = data['q_id'];
					
					//jos mentiin kyselyssä taaksepäin, checkataan vastaus joka on viimeksi vastattu
                    if (typeof(data['prevans']) !== "undefined" && data['prevans'] !== null){    
                        $('#'+data['prevans']).prop("checked", true);  
                    }
                }
            }
        });
    };
});
