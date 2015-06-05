$( document ).ready(function() {
    //osoite ajax-pyynnöille ja väliaikaismuisti peru-näppäintä varten
	var php_url = "./test.php";
    var muok_varasto = [];
	
	
    $('#alleycatblues').change(function() {
		if ($('#alleycatblues').val() !== ""){
			//json objekti ajax-pyyntöä varten
			var data = {
				"action": "haecat_pan",
				"kategoria": $( "#alleycatblues" ).val(),
				};
			data = $(this).serialize() + "&" + $.param(data);
			
			var boxarray = [];
			
			$.ajax({
				method: "POST",
				dataType: "json",
				data:data,
				url: php_url,
				cache: false,
				success:function( data ) {
					//täytetään array html-koodilla ja liitetään arrayn arvot yhteen ja kirjoitetaan diviin
					var array = [];
					array.push('<div class="table"><div class="row">');
					array.push('<div class="thead">Kysymys</div>');
					array.push('<div class="thead">Vastaus 1</div>');
					array.push('<div class="thead">Vastaus 2</div>');
					array.push('<div class="thead">Vastaus 3</div>');
					array.push('<div class="thead">Vastaus 4</div>');
					array.push('<div class="tanshead">Kuva</div>');
					array.push('<div class="tanshead">Oikea vastaus</div>');
					array.push('<div class="theaddemo">Demo</div>');
					array.push('<div class="theaddemo">ID</div>');
					array.push('</div>');
					var i = 1;
					$.each(data['catarray'], function(index, item) {
						array.push('<div class="row">');
							//data-kyspanel-dindex arvoon tallennetaan rivin id, jotta muokatessa arvoja voidaan hakea oikea rivi
							//data-kyspanel-id arvoon kirjoitetaan mikä arvo on kyseessä, kuten kysymys tai joku vastaus
							//data-kyspanel-ansid arvoon kirjoitetaan vastauksen id tietokannassa
							array.push('<div data-kyspanel-dindex="'+i+'" data-kyspanel-id="titleq" class="cell">' + item['titleq'] + '</div>');
							array.push('<div data-kyspanel-dindex="'+i+'" data-kyspanel-ansid="'+item['ansid1']+'" data-kyspanel-id="answer1" class="cell">' + item['answer1'] + '</div>');
							array.push('<div data-kyspanel-dindex="'+i+'" data-kyspanel-ansid="'+item['ansid2']+'" data-kyspanel-id="answer2" class="cell">' + item['answer2'] + '</div>');
							array.push('<div data-kyspanel-dindex="'+i+'" data-kyspanel-ansid="'+item['ansid3']+'" data-kyspanel-id="answer3" class="cell">' + item['answer3'] + '</div>');
							array.push('<div data-kyspanel-dindex="'+i+'" data-kyspanel-ansid="'+item['ansid4']+'" data-kyspanel-id="answer4" class="cell">' + item['answer4'] + '</div>');
							if(item['image']===""){ 
								array.push('<div data-kyspanel-dindex="'+i+'" data-kyspanel-id="kuve" class="anscell"></div>');
							} else{
								//kuville annetaan linkki kuvaan ja kirjoitetaan kuvan nimi
								array.push('<div data-kyspanel-dindex="'+i+'" data-kyspanel-id="kuve" class="anscell"><a href="./img/' + item['image'] + '" >'+item['image']+'</a></div>');    
							}
							//data-kyspanel-oikvas arvoon kirjoitetaan oikea vastaus, jotta sen voi löytää kun oikeaa vastausta muutetaan
							array.push('<div class="anscell" data-kyspanel-dindex="'+i+'" data-kyspanel-oikvas="'+item['oikeavastaus']+'" data-kyspanel-id="oikeavas">Vastaus ' + item['oikeavastaus'] + '</div>');
							//checkboxille, jolla voi muuttaa kysymyksestä testikysymyksen, annetaan oma id jonka avulla voidaan tehdä ajax-pyyntö
							var tempstr = "kys"+item['id'];
							array.push('<div data-kyspanel-dindex="'+i+'" class="celldemo"><input type="checkbox" class="dcb" id="'+tempstr+'" value="'+item['id']+'"/></div>');
							array.push('<div data-kyspanel-dindex="'+i+'" data-kyspanel-id="id" class="celldemo">'+item['id']+'</div>');
							//kysymysten muokkausnäppäimillie annetaan oma div, ja jokaiselle annetaan data-kyspanel-index, jonka avulla saadaan muokattua riviä jolle näppäin kuuluu
							array.push('<div data-kyspanel-dindex="'+i+'" id="but'+i+'">')
							array.push('<button data-kyspanel-index="'+i+'" class="muok">Muokkaa kysymystä</button>');
							array.push('<button data-kyspanel-index="'+i+'" class="vaihcat">Vaihda kysymyksen kategoria</button>');
							array.push('<button style="display:none" data-kyspanel-index="'+i+'" class="tall">Tallenna kysymys</button>');
							array.push('<button style="display:none" data-kyspanel-index="'+i+'" class="peru">Peruuta</button>');
							array.push('</div>')
							//laitetaan arrayyn kaikki checkboxit
							boxarray.push({
									id: tempstr,
									demo: item['demokys']
							});
						array.push('</div>');
						i++;
					});
					array.push('</div>');
					$("#asdid").html(array.join(''));
					//täytetään kaikki checkboxit jotka kuuluvat demokyselyyn
					$.each(boxarray, function(index, item){
						if (item['demo']==="1"){
							$('#'+item['id']).prop('checked', true);
						}
					});
				}
			});
		}
    });
    
	//kysymyksen muokkaus
    $('body').on('click', '.muok', function(){
		//otetaan rivin index-arvo, jotta osataan muokata oikeata riviä
		var k_id=$(this).data("kyspanel-index");
		//piilotetaan muokkausnäppäimet ja kategorian vaihtamisnäppäimet
        $('.muok').hide();
        $('.vaihcat').hide();
        $(this).hide();
		//näytetään tallenna ja peru näppäimet muokattavalle riville
        $(".tall[data-kyspanel-index='"+k_id+"']").show();
        $(".peru[data-kyspanel-index='"+k_id+"']").show();
		
		//tehdään array kaikille rivin diveille
        var asd= [];
        $.each($("div[data-kyspanel-dindex='"+k_id+"']"), function(index, value){
            asd.push(value);
        });
		
		//kirjoitetaan rivin tekstit väliaikaseen muistiin
        for(var i = 0;i<5;i++){
			muok_varasto.push(asd[i]['outerText']);
		}
		
		//kirjoitetaan muistiin myös oikeaa vastaus
		muok_varasto.push($("div[data-kyspanel-dindex='"+k_id+"'][data-kyspanel-id='oikeavas']").data('kyspanel-oikvas'));
		console.log(muok_varasto);
		
		//kirjoitetaan muistiin myös linkki kuvaan
		muok_varasto.push($('div[data-kyspanel-dindex="'+k_id+'"][data-kyspanel-id="kuve"]')[0]['outerText']);
		
		//muokataan kuvan kohdalle tiedoston lataaminen, jolla voi ladata uuden kuvan
		//ja tiedoston poistamisnäppäin joka poistaa kuvan
		$("div[data-kyspanel-dindex='"+k_id+"'][data-kyspanel-id='kuve']").html(
			'Uusi kuva:<br>'+
			'<form data-kyspanel-index="'+k_id+'" method="post" id="fileinfo" name="fileinfo">'+
			'<input type="file" name="file" required />'+
			'<input type="submit" value="Tallenna tiedosto" /></form>'+
			'<button data-kyspanel-index="'+k_id+'" id="poista">Poista kuva</button>');
		//divistä korkeampi
		$("div[data-kyspanel-dindex='"+k_id+"'][data-kyspanel-id='kuve']").css('height','150');
		
		//oikean vastauksen tilalle 4 radio buttonia joilla voi valita oikean vastauksen
		$("div[data-kyspanel-dindex='"+k_id+"'][data-kyspanel-id='oikeavas']").html(
		'<input id="oikeavas1" type="radio" name="oikeavas" value="1">1'+
		'<input id="oikeavas2" type="radio" name="oikeavas" value="2">2'+
		'<input id="oikeavas3" type="radio" name="oikeavas" value="3">3'+
		'<input id="oikeavas4" type="radio" name="oikeavas" value="4">4'
		);
		
		//täytetään oikea radio button
		$('#oikeavas'+muok_varasto[5]).prop("checked", true);  
		
		//korvataan kysymys ja vastauksen tekstilaatikoilla johon voi kirjoittaa uuden kysymyksen ja vastaukset
		//tehdään divistä myös korkeampi jotta textareaan mahtuu kirjoittamaan
        $("div[data-kyspanel-dindex='"+k_id+"'][data-kyspanel-id='titleq']").html('<textarea rows="13" cols="20" id="titleq" type="textbox" >'+asd[0]["outerText"]+'</textarea>');
        $("div[data-kyspanel-dindex='"+k_id+"'][data-kyspanel-id='titleq']").css('height','200');
        for(var i = 1;i<5;i++){
            $("div[data-kyspanel-dindex='"+k_id+"'][data-kyspanel-id='answer"+i+"']").html('<textarea rows="13" cols="20" id="answer'+i+'" type="textbox" >'+asd[i]["outerText"]+'</textarea>');
            $("div[data-kyspanel-dindex='"+k_id+"'][data-kyspanel-id='answer"+i+"']").css('height','200');
        }
		
		
    });
    
	//kysymyksen tallentaminen
    $('body').on('click', '.tall', function(){
        $(this).hide();
        $('.muok').show();
        $('.vaihcat').show();
		$('.peru').hide();
		//tyhjennetään kysymysten muokkauksen välimuisti, ettei se aiheuta bugeja
		muok_varasto = [];
        var k_id=$(this).data("kyspanel-index");
        
		//valitaan jokaisesta vastaustekstilaatikosta parent, jolta saadaan vastauksen id
		var asn1par=$("#answer1").parent();
        var asn2par=$("#answer2").parent();
        var asn3par=$("#answer3").parent();
        var asn4par=$("#answer4").parent();
        var data={
            action:'tallinna',
            titleq:$("#titleq").val(),
            oikeavas:$('input:radio[name=oikeavas]:checked').val(),
            ansid1:asn1par.data('kyspanel-ansid'),
            ansid2:asn2par.data('kyspanel-ansid'),
            ansid3:asn3par.data('kyspanel-ansid'),
            ansid4:asn4par.data('kyspanel-ansid'),
            answer1:$("#answer1").val(),
            answer2:$("#answer2").val(),
            answer3:$("#answer3").val(),
            answer4:$("#answer4").val(),
            id:$('div[data-kyspanel-dindex="'+k_id+'"][data-kyspanel-id="id"]')[0]['outerText']
        };
        data = $(this).serialize() + "&" + $.param(data);
		
        
        $.ajax({
            method: "POST",
            dataType: "json",
            data:data,
            url: php_url,
            cache: false,
            success:function( data ) {
				//laitetaan kysymys ja vastaukset arrayyn...
                var asd = [];
                asd.push($("div[data-kyspanel-dindex='"+k_id+"'][data-kyspanel-id='titleq']"));
                asd.push($("div[data-kyspanel-dindex='"+k_id+"'][data-kyspanel-id='answer1']"));
                asd.push($("div[data-kyspanel-dindex='"+k_id+"'][data-kyspanel-id='answer2']"));
                asd.push($("div[data-kyspanel-dindex='"+k_id+"'][data-kyspanel-id='answer3']"));
                asd.push($("div[data-kyspanel-dindex='"+k_id+"'][data-kyspanel-id='answer4']"));
                var i=1;
				//...jotta niiden arvot voidaan kirjoittaa yhdellä loopilla
				//korjataan myös divien koko oikeaksi
                $.each(asd, function(index,value){
                   value.html(data["r"+i]);
                   value.css('height','40');
                   i++;
                });
				
				//muokataan oikean vastauksen data-kyspanel-oikvas
				$("div[data-kyspanel-dindex='"+k_id+"'][data-kyspanel-id='oikeavas']").html('Vastaus '+data['r6']);
				$("div[data-kyspanel-dindex='"+k_id+"'][data-kyspanel-id='oikeavas']").data('kyspanel-oikvas',data['r6']);
				
				//muokataan kysymys
				//korjataan myös divin koko oikeaksi
				if(data['r7']!==''){ 
					$("div[data-kyspanel-dindex='"+k_id+"'][data-kyspanel-id='kuve']").html('<a href="./img/' + data['r7'] + '" >'+data['r7']+'</a>');
				} else{
					$("div[data-kyspanel-dindex='"+k_id+"'][data-kyspanel-id='kuve']").html('');    
				}
				$("div[data-kyspanel-dindex='"+k_id+"'][data-kyspanel-id='kuve']").css('height','40');
            }
        });
    });
    
	$('body').on('click', '.peru', function(){
		//peruuta :D
		var k_id=$(this).data("kyspanel-index");
		$(this).hide();
        $('.muok').show();
		$('.vaihcat').show();
		$(".tall[data-kyspanel-index='"+k_id+"']").hide();
		
		//laitetaan kysymys ja vastaukset arrayyn...
		var asd = [];
        asd.push($("div[data-kyspanel-dindex='"+k_id+"'][data-kyspanel-id='titleq']"));
        asd.push($("div[data-kyspanel-dindex='"+k_id+"'][data-kyspanel-id='answer1']"));
        asd.push($("div[data-kyspanel-dindex='"+k_id+"'][data-kyspanel-id='answer2']"));
        asd.push($("div[data-kyspanel-dindex='"+k_id+"'][data-kyspanel-id='answer3']"));
        asd.push($("div[data-kyspanel-dindex='"+k_id+"'][data-kyspanel-id='answer4']"));
        var i=0;
		//...jotta niiden arvot voidaan kirjoittaa välimuistista yhdellä loopilla
		//korjataan myös divien koko oikeaksi
        $.each(asd, function(index,value){
			value.html(muok_varasto[i]);
			value.css('height','40');
			i++;
        });
		
		//korjataan oikea vastaus
		//data-kyspanel-oikvas ei tarvitse muokata, koska sitä ei ole vielä vaihdettu
		$("div[data-kyspanel-dindex='"+k_id+"'][data-kyspanel-id='oikeavas']").html('Vastaus '+muok_varasto[5]);
		
		
		//jos välimuistissa on kuva, korvataan nykyinen välimuistilla
		console.log(muok_varasto[6]);
		if(typeof(muok_varasto[6])!=="undefined"){ 
			$("div[data-kyspanel-dindex='"+k_id+"'][data-kyspane l-id='kuve']").html('<a href="./img/' + muok_varasto[6] + '" >'+muok_varasto[6]+'</a>');
		} 
		//korjataan kuvapaneelin koko
		$("div[data-kyspanel-dindex='"+k_id+"'][data-kyspanel-id='kuve']").css('height','40');
		//tyhjennetään välimuisti
		muok_varasto = [];
	});
	
	//merkitään demokysymys
    $('body').on('change', '.dcb', function(){
		//tarkistetaan onko demossa 5 kysymystä
        var temp=0;
        if (this.checked)
			{temp = 1}
        else {
            var i = 0;
            $('.dcb').each( function() {
                if (this.checked)
                    {i++;}
            });
            console.log(i);
            if (i!==5){
				//jos demossa ei ole 5 kysymystä, näytetään virheilmoitus
                $("#ewqewq").flash_message({
                    text: 'demotestissä täytyy olla 5 kysymystä',
                    how: 'append'
                });
            }        
        }
        var data = {
            action:'bennys',
            id:this.value,             
            value:temp
        };
        //lähetetään palvelimelle käsky lisätä kysymys demoon
        $.ajax({
            method: "POST",
            dataType: "json",
            data:data,
            url: php_url,
            cache: false,
            success:function( data ) {
                console.log(data['joo']);
				//jos kysymys lisättiin, näytetään ilmoitus että kysymys on lisätty
                $("#qweww").flash_message({
                    text: data['joo'],
                    how: 'append'
                });
            }});
    });
	
	//vaihdetaan kategoria
	$('body').on('click', '.vaihcat', function(){
		//kun painetaan näppäintä, tehdään tiputusvalikko josta valitaan kategoria johon kysymys siirretään
		var k_id=$(this).data("kyspanel-index");
		$('.vaihcat').hide();
		$('.muok').hide();
		
		$.ajax({
			method: "POST",
			dataType: "json",
			data: {action:"kategoriat"},
			url: php_url,
			cache: false,
			success:function( data ) {
				var array = [];
				array.push('<select id="select'+k_id+'" class="select" name="kategoria">');
				for(var i = 0; i<data['catmaara'];i++){
					array.push('<option value="'+data['catarray']['id'][i]+'">'+data['catarray']['name'][i]+'</option>');
				};
				array.push('</select>');
				array.push('<button class="select" data-kyspanel-index="'+k_id+'" id="vaihdacat">Vaihda kategoria</button>');
				//tehdään myös uusi näppäin josta vaihdetaan kategoria kun oikea kategoria on valittu tiputusvalikosta
				//pidetään tiputusvalikossa mukana rivin index, jotta sitä voidann myöhemmin käyttää kysymyksen siirtämiseen
				$('#but'+k_id).append(array.join(''));
			}
		});
		
		
	});
	
	$('body').on('click', '#vaihdacat', function(){
		//kun on painettu uutta näppäintä
		var k_id=$(this).data("kyspanel-index");
		$('.vaihcat').show();
		$('.muok').show();
		
		//otetaan vanha kategoria talteen ja poistetaan tiputusvalikko
		var cat= $('#select'+k_id).val();
		var vancat = $('#alleycatblues').val();
		$('.select').remove();
		
		//tarkistetaan että uusi kategorian on eri kuin vanha kategoria
		//sitten lähetetään ajax-pyyntö ja palvelin vaihtaa kysymyksen kategorian
		if(cat!==vancat){
			$.ajax({
				method: "POST",
				dataType: "json",
				data: {
					action:"vaihcat",
					id:$('div[data-kyspanel-dindex="'+k_id+'"][data-kyspanel-id="id"]')[0]['outerText'],
					cat:cat
					},
				url: php_url,
				cache: false,
				success:function( data ) {
					//jos palvelimelta ei palaudu virhettä, poistetaan rivi sivulta
					if (typeof(data['err'])==="undefined"){
						$("div[data-kyspanel-dindex='"+k_id+"']").remove();
					}
				}
			});
		};
	});
	
	// poistetaan kuva
	$('body').on('click', '#poista', function(){
		var k_id=$(this).data("kyspanel-index");
		console.log(k_id);
		var data = {
			action:"poistakuva",
			id:$('div[data-kyspanel-dindex="'+k_id+'"][data-kyspanel-id="id"]')[0]['outerText'],
			name:muok_varasto[6]
		} 
		$.ajax({
			method: "POST",
			dataType: "json",
			data: data,
			url: php_url,
			cache: false,
			success:function( data ) {
				//tyhjennetään kuvan div, muokataan siitä oikean kokoinen ja poistetaan kuva välimuistista
				$("div[data-kyspanel-dindex='"+k_id+"'][data-kyspanel-id='kuve']").html('');
				$("div[data-kyspanel-dindex='"+k_id+"'][data-kyspanel-id='kuve']").css('height','40');
				muok_varasto.splice(6,1);
			}
		});
	});
    
	//tiedoston lähetys ajax-pyynnöllä
	$('body').on('submit', '#fileinfo', function(e) {
		var k_id=$(this).data("kyspanel-index");
		//estetään sivua lataamasta uudelleen
		e.preventDefault();
		e.stopPropagation(); 
		console.log("submit event");
		var fd = new FormData(this);
		$.ajax({
			//ajax-pyyntö tehdään eri osoitteeseen
			url: "./upload.php",
			type: "POST",
			data: fd,
			enctype: 'multipart/form-data',
			processData: false,  	// estetään jqueryä
			contentType: false,   	// sotkemasta dataa
			success:function( data ) {
				//koska palvelin ei tällä kertaa palauta json objektia, se täytyy parsia
				data = JSON.parse(data);
				console.log(data);
				//tarkistetaan tuliko palvelimelta virheitä
				if (typeof(data['err'])!=="undefined"){
					$('#fileinfo').flash_message({
						text: data['err'],
						how: 'append'
					});
				}
				//jos tiedoston lataus onnistui, tehdään uusi ajax-pyyntö
				if (data['success']==="success"){
					var data2 = {
						action:'tallkuva',
						name:data['fname'],
						id:$('div[data-kyspanel-dindex="'+k_id+'"][data-kyspanel-id="id"]')[0]['outerText'],
						van_kuv:muok_varasto[6]
					};
					$.ajax({
						method: "POST",
						dataType: "json",
						data: data2,
						url: php_url,
						cache: false,
						success:function( idata ) {
							//kun ajax-pyyntö onnistuu, korvataan divin sisältö linkillä uuteen kuvaan ja korjataan divin koko
							$("div[data-kyspanel-dindex='"+k_id+"'][data-kyspanel-id='kuve']").html('<a href="./img/' + idata['name'] + '" >'+idata['name']+'</a>');
							$("div[data-kyspanel-dindex='"+k_id+"'][data-kyspanel-id='kuve']").css('height','40');
							//poistetaan kuva välimuistista ettei uusi kuva korvaannu jos muokkaus perutaan
							muok_varasto.splice(6,1);
						}
					});
				}
				
			}
		});
	});
	
//skripti  viestin väläyttämiseen sivulla
(function($) {
    $.fn.flash_message = function(options) {
      
      options = $.extend({
        text: 'Done',
        time: 1000,
        how: 'before',
        class_name: ''
      }, options);
      
      return $(this).each(function() {
        if( $(this).parent().find('.flash_message').get(0) )
          return;
        
        var message = $('<span />', {
          'class': 'flash_message ' + options.class_name,
          text: options.text
        }).hide().fadeIn('fast');
        
        $(this)[options.how](message);
        
        message.delay(options.time).fadeOut('normal', function() {
          $(this).remove();
        });
        
      });
    };
})(jQuery);

});