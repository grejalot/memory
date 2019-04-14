
$(document).ready(function(){


    function generer_plateau(){ 
        
        var fruits = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,14,14,15,15,16,16,17,17];

        for (var i=0;i<36;i++){
            $('.plateau').append('<div class="carte masquee" id="carte_'+i+'"></div>');

            var decompte = 36-i;
            var hasard = Math.floor(Math.random()*Math.floor(decompte));
            var fruit = fruits[hasard];

            fruits.splice(hasard, 1);


            var fond = -(fruit)*100;

            $('#carte_'+i).css("background-position", "center "+fond+"px");
            $('#carte_'+i).text(i+" - "+fruit);

            console.log(fruits);

        }
    }

    function rejouer(){
        $('.carte').remove();
        generer_plateau();
    }


    generer_plateau();

    $('.plateau').on('click', '.carte', function(){
        /*var x = $(this).attr('id');
        alert(x);*/

        if($(this).hasClass("visible")){
            $(this).removeClass("visible").addClass("masquee");
        }else{
            $(this).removeClass("masquee").addClass("visible");
        }
    });

    $('#rejouer').click(function(){
        rejouer();
    });


});


    
