
$(document).ready(function(){

    // VARIABLES /////////////////////////////////////////////////////////////////////////
    // Ici, on va déclarer toutes les variables qui vont nous servir pour l'exercice

    var ensembleDesCartes = new Object();
    var nbCartesVisibles = 0;
    var Carte1 = new Object();
    var Carte2 = new Object();
    var score = 0;
    var nbCartes = 12;
    var dureeChrono = 5;
    var tempsRestant = null;
    var pourcentageProgression = null;
    var nbClic = 0;
    var timer = null;

    // FONCTIONS /////////////////////////////////////////////////////////////////////////
    // Ici, on va déclarer toutes les fonctions du jeu (mélange des cartes, score, timer etc.)

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

            tempsRestant = dureeChrono;
            pourcentageProgression = (tempsRestant*100)/dureeChrono;
            $('#barreProgression').width(pourcentageProgression+"%");

        }
    }


    function Carte(id, fruit, status) {
        this.id = id;
        this.fruit = fruit;
        this.status = status;
      }


    function verification(carte){
        objCarte = ensembleDesCartes[carte];
        idCarte = '#'+carte;

        if(nbClic == 0){
            lancerChrono();
        }

        nbClic ++;


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
        arreterChrono();
        alert('Gagné !')
    }


    function perdu(){

        nbCartesVisibles = 0;
        Carte1 = "";
        Carte2 = "";
        score = 0;
        nbClic = 0;

        $('.carte').remove();

        alert('Perdu !')
    }

    function lancerChrono(){
        $('#temps').text("Temps restant : "+tempsRestant);
        timer = setInterval(chronometre, 10);
    }


    function finChrono(){
        arreterChrono();
        perdu();
    }

    function arreterChrono(){
        clearInterval(timer);
        timer = null;
        $('#temps').text("Temps restant : ");
        tempsRestant = dureeChrono;
    }

    function chronometre(){
        tempsRestant -= 0.01;
        $('#temps').text("Temps restant : "+Math.round(tempsRestant));

        pourcentageProgression = (tempsRestant*100)/dureeChrono;

        $('#barreProgression').width(pourcentageProgression+"%");
        if(tempsRestant <= 0) finChrono();
    }


    function rejouer(){

        nbCartesVisibles = 0;
        Carte1 = "";
        Carte2 = "";
        score = 0;
        nbClic = 0;
        arreterChrono();

        $('.carte').remove();
        generer_plateau();
        //console.log(ensembleDesCartes);
    }

    function afficherScores(){

        $.post(
            'php/meilleursscores.php', // Un script PHP que l'on va créer juste après
            {/*
                username : $("#username").val(),  // Nous récupérons la valeur de nos inputs que l'on fait passer à connexion.php
                password : $("#password").val()*/
            },

            function(data){ // Cette fonction ne fait rien encore, nous la mettrons à jour plus tard

                $("#tableauScores").text(data);

            },

            'html' // Nous souhaitons recevoir "Success" ou "Failed", donc on indique text !
         );
        
    }

    function afficherScores(){
         $("#tableauScores").load('php/meilleursscores.php');;
    }

    // EVENEMENTS ////////////////////////////////////////////////////////////////////////
    // Ici, on va déclarer tous les évènements qui vont avoir une action sur le jeu

    afficherScores();


    $('.plateau').on('click', '.carte', function(){

        verification($(this).attr('id'));

    });

    $('#rejouer').click(function(){
        rejouer();
    });


});


    
