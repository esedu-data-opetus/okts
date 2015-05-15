$( document ).ready(function() {
    var php_url = "./test.php";
    
    $('#demokysbox').change()
    
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
                array.push('<div class="thead">Oikea vastaus</div>');
                array.push('<div class="theaddemo">Demo</div>');
                array.push('</div>');
                
                $.each(data['catarray'], function(index, item) {
                    array.push('<div class="row">');
                        array.push('<div class="cell">' + item['titleq'] + '</div>');
                        array.push('<div class="cell">' + item['answer1'] + '</div>');
                        array.push('<div class="cell">' + item['answer2'] + '</div>');
                        array.push('<div class="cell">' + item['answer3'] + '</div>');
                        array.push('<div class="cell">' + item['answer4'] + '</div>');
                        var tempstr = "answer"+item['oikeavastaus'];
                        array.push('<div class="cell">' + item[tempstr] + '</div>');
                        var tempstr = "kys"+item['id'];
                        array.push('<div class="celldemo"><input type="checkbox" class="dcb" id="'+tempstr+'" value="'+item['id']+'"/></div>');
                        boxarray.push({
                                id: tempstr,
                                demo: item['demokys']
                          });
                    array.push('</div>');
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