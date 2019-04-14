
$(document).ready(function(){

    var fruits = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,14,14,15,15,16,16,17,17,18,18];

    function generer(){
        for (var i=0;i<36;i++){
            $('.plateau').append('<div class="carte" id="carte_'+i+'"></div>');

            var fruit = -(fruits[i])*100;

            $('#carte_'+i).css("background-position", "center "+fruit+"px");
            $('#carte_'+i).text(fruits[i]);

        }
    }
    generer();

    $('.carte').click(function(){
        var x = $(this).attr('id');
        alert(x);

    });


});


    
