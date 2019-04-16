
$(document).ready(function(){

    // VARIABLES /////////////////////////////////////////////////////////////////////////
    // Ici, on va déclarer toutes les variables qui vont nous servir pour l'exercice

    var ensembleDesCartes = new Object();
    var nbCartesVisibles = 0;
    var Carte1 = new Object();
    var Carte2 = new Object();
    var pairesValidees = 0;
    var nbCartes = 6;
    var dureeChrono = 10;
    var tempsAffiche = 0;
    var tempsEcoule = 0;
    var scoreJoueur = 0;
    var pourcentageProgression = null;
    var nbClic = 0;
    var timer = null;
    var partieGagnee = false;

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

            $('#barreProgression').width("100%");

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
        pairesValidees ++;
        if(pairesValidees==(nbCartes/2)){
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
        scoreJoueur = tempsAffiche;
        arreterChrono();
        partieGagnee = true;
        $('#scoreJoueur').text("Score : "+scoreJoueur);
        alert('Gagné !')
    }


    function perdu(){

        nbCartesVisibles = 0;
        Carte1 = "";
        Carte2 = "";
        pairesValidees = 0;
        nbClic = 0;

        $('.carte').remove();

        alert('Perdu !')
    }

    function lancerChrono(){
        $('#temps').text("Temps restant : "+tempsEcoule);
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
        tempsEcoule = 0;
        tempsAffiche = 0;
    }

    function chronometre(){
        tempsEcoule += 0.01
        tempsAffiche = (Math.round(tempsEcoule*100))/100;
        $('#temps').text("Temps restant : "+tempsAffiche);

        pourcentageProgression = 100-((tempsEcoule*100)/dureeChrono);

        $('#barreProgression').width(pourcentageProgression+"%");
        if(tempsEcoule >= dureeChrono) finChrono();
    }


    function rejouer(){

        nbCartesVisibles = 0;
        Carte1 = "";
        Carte2 = "";
        pairesValidees = 0;
        nbClic = 0;

        partieGagnee = false;
        scoreJoueur = 0;
        $('#scoreJoueur').text("");
        arreterChrono();

        $('.carte').remove();
        generer_plateau();
        //console.log(ensembleDesCartes);
    }

    function afficherScores(){
         $("#tableauScores").load('php/meilleursscores.php');
    }

    function sauvegarderScore(joueur,score){

        $.post(
            'php/sauvegarderscore.php', // Un script PHP que l'on va créer juste après
            {
                pseudoJoueur : joueur,  // Nous récupérons la valeur de nos inputs que l'on fait passer à connexion.php
                scoreJoueur : score
            },

            function(data){ // Cette fonction ne fait rien encore, nous la mettrons à jour plus tard
                if(data=="ok"){
                    $("#felicitations").text("Félicitations ! Ton score a bien été ajouté !");
                    scoreJoueur = 0;
                    $('#scoreJoueur').text("Score : ");
                }else{
                    $("#felicitations").html(data);
                }
            },

            'text' // Nous souhaitons recevoir le texte de retour de la fonction
         );

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

    $('.formulaire').on('click', '#envoi', function(e){
        e.preventDefault(); // on empêche le bouton d'envoyer le formulaire
    
        var pseudoJoueur = encodeURIComponent( $('#pseudoJoueur').val() ); // on sécurise les données

        if(partieGagnee==true){ // on vérifie que la partie est gagnée à cet instant

            if(scoreJoueur != 0){ // on vérifie que le score est valide

                if(pseudoJoueur != ""){ // on vérifie que les variables ne sont pas vides
                    sauvegarderScore(pseudoJoueur,scoreJoueur);
                    afficherScores();
                }else{
                    $("#felicitations").text("Le nom du pseudo n'est pas renseigné");
                }

            }else{
                $("#felicitations").text("Vous n'avez pas de score");
            }

        }else{
            $("#felicitations").text("La partie n'est pas gagnée.");
        }
    });
    


});


    
