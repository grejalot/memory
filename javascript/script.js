
$(document).ready(function(){

    var ensembleDesCartes = new Object();
    var nbCartesVisibles = 0;
    var Carte1 = new Object();
    var Carte2 = new Object();
    var score = 0;
    var nbCartes = 12;


    function generer_plateau(){ 
        
        var fruits = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,14,14,15,15,16,16,17,17];

        for (var i=0;i<nbCartes;i++){
            $('.plateau').append('<div class="carte masquee" id="carte_'+i+'"></div>');

            var hasard = Math.floor(Math.random()*Math.floor(nbCartes-i));
            var fruit = fruits[hasard];

            fruits.splice(hasard, 1);

            numeroCarte = "carte_"+i;
            fruitCarte = fruit;



            var fond = -(fruit)*100;

            var carte = new Carte('#'+numeroCarte, fruitCarte, "masquee")

            ensembleDesCartes[numeroCarte] = carte;

            $('#carte_'+i).css("background-position", "center "+fond+"px");
            $('#carte_'+i).text(fruit);

            //console.log(fruits);


        }
    }

    generer_plateau();

    function Carte(id, fruit, status) {
        this.id = id;
        this.fruit = fruit;
        this.status = status;
      }


    function verification(carte){
        objCarte = ensembleDesCartes[carte];
        idCarte = '#'+carte;


        console.log(objCarte.status);


        if(nbCartesVisibles<2 && objCarte.status=="masquee"){

            if(nbCartesVisibles==0){

                Carte1=objCarte;
                Carte1.status = "visible";

                $(idCarte).removeClass("masquee").addClass("visible");

                nbCartesVisibles++;

            }else if(nbCartesVisibles==1){
                Carte2=objCarte;
                Carte2.status = "visible";
                $(idCarte).removeClass("masquee").addClass("visible");
                nbCartesVisibles++;


                if(Carte1.fruit==Carte2.fruit){

                    reussi(Carte1,Carte2);

                }else{
                    setTimeout(function(){ rate(Carte1,Carte2); }, 1000);
                    ;
                }


            }

            console.log(objCarte.status);
    
            console.log("carte 1 : "+Carte1.fruit+" et carte 2 : "+Carte2.fruit);

        }

    }





    function reussi(obj1, obj2){
        Carte1 = obj1;
        Carte2 = obj2;
        Carte1.status = "validee";
        Carte2.status = "validee";
        $(Carte1.id).removeClass("visible").addClass("validee");
        $(Carte2.id).removeClass("visible").addClass("validee");
        nbCartesVisibles=0;
        Carte1 = "";
        Carte2 = "";
        score ++;
        if(score==(nbCartes/2)){
            gagne();
        }
    }


    function rate(obj1, obj2){
        Carte1 = obj1;
        Carte2 = obj2;
        Carte1.status = "masquee";
        Carte2.status = "masquee";
        $(Carte1.id).removeClass("visible").addClass("masquee");
        $(Carte2.id).removeClass("visible").addClass("masquee");
        nbCartesVisibles=0;
        Carte1 = "";
        Carte2 = "";
    }


    function gagne(){
        alert('Gagné !')
    }


    function rejouer(){

        var nbCartesVisibles = 0;
        Carte1 = "";
        Carte2 = "";

        $('.carte').remove();
        generer_plateau();
        //console.log(ensembleDesCartes);
    }


    $('.plateau').on('click', '.carte', function(){

        verification($(this).attr('id'));

    });

    $('#rejouer').click(function(){
        rejouer();
    });


});


    
