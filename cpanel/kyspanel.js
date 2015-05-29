$( document ).ready(function() {
    var php_url = "../test.php";
    
    $('#alleycatblues').change(function() {
        
    if ($('#alleycatblues').val() !== ""){
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
                var array = [];
                array.push('<div class="table"><div class="row">');
                array.push('<div class="thead">Kysymys</div>');
                array.push('<div class="thead">Vastaus 1</div>');
                array.push('<div class="thead">Vastaus 2</div>');
                array.push('<div class="thead">Vastaus 3</div>');
                array.push('<div class="thead">Vastaus 4</div>');
                array.push('<div class="thead">Kuva</div>');
                array.push('<div class="thead">Oikea vastaus</div>');
                array.push('<div class="theaddemo">Demo</div>');
                array.push('<div class="theaddemo">ID</div>');
                array.push('</div>');
                var i = 1;
                $.each(data['catarray'], function(index, item) {
                    array.push('<div class="row">');
                        array.push('<div data-kyspanel-dindex="'+i+'" data-kyspanel-id="titleq" class="cell">' + item['titleq'] + '</div>');
                        array.push('<div data-kyspanel-dindex="'+i+'" data-kyspanel-ansid="'+item['ansid1']+'" data-kyspanel-id="answer1" class="cell">' + item['answer1'] + '</div>');
                        array.push('<div data-kyspanel-dindex="'+i+'" data-kyspanel-ansid="'+item['ansid2']+'" data-kyspanel-id="answer2" class="cell">' + item['answer2'] + '</div>');
                        array.push('<div data-kyspanel-dindex="'+i+'" data-kyspanel-ansid="'+item['ansid3']+'" data-kyspanel-id="answer3" class="cell">' + item['answer3'] + '</div>');
                        array.push('<div data-kyspanel-dindex="'+i+'" data-kyspanel-ansid="'+item['ansid4']+'" data-kyspanel-id="answer4" class="cell">' + item['answer4'] + '</div>');
                        if(item['image']===""){ 
                        array.push('<div data-kyspanel-dindex="'+i+'" data-kyspanel-id="kuve" class="cell"></div>');
                        } else{
                        array.push('<div data-kyspanel-dindex="'+i+'" data-kyspanel-id="kuve" class="cell"><a href="./img/' + item['image'] + '" >Link</a></div>');    
                        }
                        var tempstr = "answer"+item['oikeavastaus'];
                        array.push('<div class="cell">' + item[tempstr] + '</div>');
                        var tempstr = "kys"+item['id'];
                        array.push('<div class="celldemo"><input type="checkbox" class="dcb" id="'+tempstr+'" value="'+item['id']+'"/></div>');
                        array.push('<div data-kyspanel-dindex="'+i+'" data-kyspanel-id="id" class="celldemo">'+item['id']+'</div>');
                        array.push('<button data-kyspanel-index="'+i+'" class="muok">Muokkaa kysymystä</button>');
                        array.push('<button style="visibility:hidden" data-kyspanel-index="'+i+'" class="tall">Tallenna kysymys</button>');
                        boxarray.push({
                                id: tempstr,
                                demo: item['demokys']
                          });
                    array.push('</div>');
                    i++;
                });
                array.push('</div>');
                $("#asdid").html(array.join(''));
                $.each(boxarray, function(index, item){
                    if (item['demo']==="1"){
                        $('#'+item['id']).prop('checked', true);
                    }
                });
            }
            
        });

        }
                
    });
    
    $('body').on('click', '.muok', function(){
        console.log($(this).data("kyspanel-index"));
        $('.muok').css('visibility','hidden');
        $(this).hide();
        $(this).css('visibility','hidden');
        $(".tall[data-kyspanel-index='"+$(this).data("kyspanel-index")+"']").css('visibility','visible');
        var asd= [];
        
        $.each($("div[data-kyspanel-dindex='"+$(this).data("kyspanel-index")+"']"), function(index, value){
            asd.push(value);
        });
        
        $("div[data-kyspanel-dindex='"+$(this).data("kyspanel-index")+"'][data-kyspanel-id='titleq']").html('<textarea rows="13" cols="20" id="titleq" type="textbox" >'+asd[0]["outerText"]+'</textarea>');
        $("div[data-kyspanel-dindex='"+$(this).data("kyspanel-index")+"'][data-kyspanel-id='titleq']").css('height','200');
        for(var i = 1;i<5;i++){
            $("div[data-kyspanel-dindex='"+$(this).data("kyspanel-index")+"'][data-kyspanel-id='answer"+i+"']").html('<textarea rows="13" cols="20" id="answer'+i+'" type="textbox" >'+asd[i]["outerText"]+'</textarea>');
            $("div[data-kyspanel-dindex='"+$(this).data("kyspanel-index")+"'][data-kyspanel-id='answer"+i+"']").css('height','200');
        }
    });
    
    $('body').on('click', '.tall', function(){
        $(this).css('visibility','hidden');
        $('.muok').css('visibility','visible');
        $('.muok').show();
        var k_id=$(this).data("kyspanel-index");
        var asn1par=$("#answer1").parent();
        var asn2par=$("#answer2").parent();
        var asn3par=$("#answer3").parent();
        var asn4par=$("#answer4").parent();
        var data={
            action:'tallinna',
            titleq:$("#titleq").val(),
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
                var asd = [];
                asd.push($("div[data-kyspanel-dindex='"+k_id+"'][data-kyspanel-id='titleq']"));
                asd.push($("div[data-kyspanel-dindex='"+k_id+"'][data-kyspanel-id='answer1']"));
                asd.push($("div[data-kyspanel-dindex='"+k_id+"'][data-kyspanel-id='answer2']"));
                asd.push($("div[data-kyspanel-dindex='"+k_id+"'][data-kyspanel-id='answer3']"));
                asd.push($("div[data-kyspanel-dindex='"+k_id+"'][data-kyspanel-id='answer4']"));
                var i=1;
                $.each(asd, function(index,value){
                   value.html(data["r"+i]);
                   value.css('height','36');
                   i++;
                });
            }
        });
    });
    
    $('body').on('change', '.dcb', function(){
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
        
        $.ajax({
            method: "POST",
            dataType: "json",
            data:data,
            url: php_url,
            cache: false,
            success:function( data ) {
                console.log(data['joo']);
                $("#qweww").flash_message({
                    text: data['joo'],
                    how: 'append'
                });
            }});
    });
    
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