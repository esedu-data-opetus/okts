
$( document ).ready(function() {
    
    var php_url = "http://localhost/PhpProject1/test.php";
    
    console.log( "ready!" );
    $('#sub-button').hide();
        $('#report-button').hide();
        $('#joniboi').hide();
        $('#cat-button').hide();
        var tempvar = {"action": "kategoriat"};
            tempvar = $(this).serialize() + "&" + $.param(tempvar);
            
                
        $.ajax({
            method: "POST",
                dataType: "json",
                data:tempvar,
                url: php_url,
                cache: false,
                success:function( data ) {
                    var array = [];
                    array.push('<div id="checkboxdiv">');
            for(var i = 0; i<data['catmaara'];i++){
            array.push('<input type="checkbox" name="kategoria" value="'+data['catarray']['id'][i]+'">'+data['catarray']['name'][i]+'</input><br>');

                    }
                array.push('</div>');
                 $("#vastaus").append(array.join(''));
             $('#vastaus').prepend('<span class="err">Valitse kategoriat</span>');}});


    var data= "";
    var kysid;
    
    $('#meemies').click(function() {
        
    data={
        "action": "aloita",
        "kategoria": GetVal("kategoria")
            };
            data = $(this).serialize() + "&" + $.param(data);
            var ses = GetVal("kategoria");
            if(ses.length>0){
                $('#meemies').hide();
        $('#cat-button').show();
            $.ajax({
        method: "POST",
            dataType: "json",
            data:data,
            url: php_url,
            cache: false,
            success:function( lod ) {
                console.log(lod);
                $('#checkboxdiv').hide();
        $('#vastaus').html(lod['catname']);}});}
    else{$('.err').css('color', 'red');}});
        

    $('#cat-button').click(function() {
        $('#cat-button').hide();
        $('#sub-button').show();
        $('#report-button').show();
        data_json("ekakys");
        ajax_haekys(data);
    });    
    
$('#sub-button').click(function() {
    
    var tempvar = $('input:radio[name=vast]:checked').val();
    if (typeof tempvar === "undefined") {}
    else{
        data_json("seuraavakys");
        ajax_haekys(data);};});   
    
$('#joniboi').click(function() {
    if (typeof $('#nick').val() !== undefined){
        data={
                "action": "vaihdatunus",
                "value":$('#nick').val()
            };
            data = $(this).serialize() + "&" + $.param(data);
        ajax_haekys(data);}
    });    

$('#report-button').click(function() {
        data_json("viimekys");
        ajax_haekys(data);
 });
 
 function GetVal(val) {
    var arr = new Array();
    $(':input[name="' + val + '"]').each(function () {
        if (this.checked) {
            arr.push($(this).attr('value'));}});
        return arr;
        
}
 
 function data_json(action) {   
            data={
                "action": action,
                "value":$('input:radio[name=vast]:checked').val(),
                "kysid": kysid
            };
            data = $(this).serialize() + "&" + $.param(data);
        };
        
    function ajax_haekys(func_data){
    $.ajax({
            method: "POST",
            dataType: "json",
            data:func_data,
            url: php_url,
            cache: false,
            success:function( data ) {
                if(data['loppu']==="end"){
                    if(data['vaihto']===1){
                    $('#vastaus').html('Tunnus vaihdettu onnistuneesti, testi tallennettu tunnuksella '+data['usr']+'<br>');
                    }
                    else{$('#vastaus').html('Testi loppui, sait '+data['log2']+' pistettä, testi tallenettu vierastunnuksella '+data['usr']+'<br>');}
                   
                    $('#vastaus').append('<input id="nick" type="text" />');
                    $('#joniboi').show();
                    $('#sub-button').hide();
        $('#report-button').hide();
        return;
                }if(data['catval']==="joo"){
                    $('#report-button').hide();
                    $('#sub-button').hide();
        $('#cat-button').show();
        $('#vastaus').html(data['catname']);
        return;
                }else{
                    var array = [];
                if (data["kuve"] !== "")
                {array.push( '<div id="kuve"><img id="joo" src="'+data["kuve"]+'"></img></div>');};
              array.push('<div id="kyse">');
                    array.push(data["kysymys"]+'<br>');
              array.push('<input id="rad1" name="vast" type=radio value="1"  />'+data["ans1"]+'<br>');
              array.push('<input id="rad2" name="vast" type=radio value="2"/>'+data["ans2"]+'<br>');
              array.push('<input id="rad3" name="vast" type=radio value="3"/>'+data["ans3"]+'<br>');
              array.push('<input id="rad4" name="vast" type=radio value="4"/>'+data["ans4"]+'<br>');
              array.push('<input id="rad5" name="vast" type=radio value="5"/>En halua vastata<br></div>');
              $("#vastaus").html(array.join(''));
              kysid = data['q_id'];
              if (typeof(data['prevans']) !== "undefined" && data['prevans'] !== null)
         {    $('#'+data['prevans']).prop("checked", true);};}}});};});
