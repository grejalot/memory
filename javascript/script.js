// Nous sommes ici dans notre fichier JavaScript, appelé par le fichier HTML (dans le header)
// C'est ici que nous allons gérer toutes les actions de l'utilisateur sur notre jeu


$(document).ready(function(){



    //////////////////////////////////////////////////////////////////////////////////////
    // VARIABLES /////////////////////////////////////////////////////////////////////////
    
    // Dans cette première partie du fichier, on va déclarer toutes les variables qui vont nous servir pour le jeu

    var nbCartes = 36;                      // Le nombre de carte que va contenir notre partie
    var dureeChrono = 99;                   // La durée du temps imparti pour finir le jeu, en seconde.

    var ensembleDesCartes = new Object();   // Un objet qui va contenir l'ensemble de notre jeu de carte
    var Carte1 = new Object();              // Un objet qui va contenir la 1ère carte retournée lors d'une comparaison de deux cartes
    var Carte2 = new Object();              // Un objet qui va contenir la 2ème carte retournée lors d'une comparaison de deux cartes

    var nbCartesVisibles = 0;               // Le nombre de cartes retournées (hors cartes validées). Va alterner entre 0, 1 et 2
    var pairesValidees = 0;                 // Le nombre de paires validées

    var tempsEcoule = 0;                    // Le temps écoulé depuis lancement du jeu (au premier clic du joueur sur une carte)
    var tempsAffiche = 0;                   // Le temps affiché au joueur (globalement, ça sera le temps écoulé, arrondi à 0.01 près)
    var scoreJoueur = 0;                    // Le score du joueur (le temps en seconde qu'il aura mis à retourner toutes les cartes)

    var pourcentageTempsRestant = 0;        // Le pourcentage du temps restant. Il va venir s'appliquer sur la taille de la barre du timer
    var timer = new Object();               // Un objet qui nous servira à lancer une fonction chronomètre toutes les 0.01 s

    var nbClic = 0;                         // Le nombre de clic effectué sur des cartes. Sert à détecter le 1er pour lancer la partie
    var partieGagnee = false;               // Booléen qui passe à true une fois la partie gagnée










    //////////////////////////////////////////////////////////////////////////////////////
    // FONCTIONS /////////////////////////////////////////////////////////////////////////
    // Ici, on va déclarer toutes les fonctions du jeu (mélange des cartes, score, timer etc.)




    // Constructeur de l'objet "Carte". Ces objet seront générés dynamiquement par la fonction generer_plateau.

    function Carte(id, fruit, status) {
        this.id = id;           //l'id de la carte
        this.fruit = fruit;     // le fruit représenté sur la carte
        this.status = status;   // le statut de la carte : masquee, visible ou validee
    }



    // Fonction qui va générer un plateau aléatoire

    function generer_plateau(){ 
        
        /* Le tableau dessous correspond aux fruits mis en jeu. Il est doublé car chaque fruit doit apparaître deux fois à chaque partie
        On aurait pu mettre directement "pomme", "pomme", "banane", "banane" etc. mais les chiffres sont plus pratique à manipuler
        */
        var fruits = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,14,14,15,15,16,16,17,17];

        // On lance une boucle qui va créer une nouvelle carte à chaque occurence, jusqu'à atteindre le nombre de carte souhaité dans le jeu
        for (var i=0;i<nbCartes;i++){

            // Création de la carte sur le plateau, avec un id unique et la classe "masquée"
            $('.plateau').append('<div class="carte masquee" id="carte_'+i+'"></div>');

            /* On prend un nombre au hasard entre 0 et le nombre de carte restant à distribuer (nombre de carte - i)
            On extrait du tableau fruits la valeur se trouvant à la position "hasard", puis on supprime cette valeur du tableau
            Ainsi, on ne pourra pas la re-choisir lors d'une prochaine occurence
            */
            var hasard = Math.floor(Math.random()*Math.floor(nbCartes-i));
            var fruit = fruits[hasard];
            fruits.splice(hasard, 1);

            // On crée un objet carte, en lui donnant en propriété son ID (carte_i), son fruit et son statut, par défaut "masquée"
            numeroCarte = "carte_"+i;
            fruitCarte = fruit;
            var carte = new Carte('#'+numeroCarte, fruitCarte, "masquee")

            // On place cet objet carte dans notre objet ensembleDesCartes
            ensembleDesCartes[numeroCarte] = carte;

            // Affiche le numéro du fruit directement sur la carte sans la retourner. Utile en pré-prod
            //$('#carte_'+i).text(fruit);

            // Pour finir, on fixe la barre du timer à 100% et on affiche un message de départ
            $('#barreProgression').width("100%");
            $('#temps').text("Cliquez sur une carte pour commencer");

        }
    }



    // La fonction la plus importante du jeu, qui va être appelée à chaque clic sur une carte, et qui va vérifier si une paire a été découverte

    function verification(carte){

        // On récupère l'objet carte dans notre ensemble de carte (l'id de la carte nous a été transmis en paramètre de la fonction)
        objCarte = ensembleDesCartes[carte];
        idCarte = '#'+carte;

        /* Si c'est le 1er clic du joueur lors de cette partie, on lance le chrono : la partie débute !
        Après, on incrémente les clics pour ne pas répéter l'action
        */
        if(nbClic == 0){
            lancerChrono();
        }
        nbClic ++;

        /* On vérifie que la carte était bien masquée (il ne doit rien se passer si le joueur clique sur une carte déjà visible ou validée)
        On vérifie aussi que 2 cartes ne sont pas déjà visibles (sans être validées).
        Si c'est le cas, ça signifie que nous sommes dans le laps de temps où un joueur s'est trompé et attend que les 2 cartes se retournent.
        Du coup, s'il clique sur une autre carte à ce moment, il ne doit rien se passer.
        */
        if(nbCartesVisibles<2 && objCarte.status=="masquee"){

            /* Si aucune carte n'était visible à ce moment là, on enregistre la carte en question dans l'objet Carte1,
            on fait passer son statut en visible, pareil pour sa classe, et on déplace en css l'image de fond pour afficher le fruit en question 
            */
            if(nbCartesVisibles==0){

                Carte1=objCarte;
                Carte1.status = "visible";

                $(idCarte).removeClass("masquee").addClass("visible");
                
                var fond = (-(Carte1.fruit)*100); // décalage pour une carte de pour 100px
                var fondProportionnel = ($(idCarte).width())*fond/100; // décalage proportionnel à la taille de la carte
                $(idCarte).css("background-position", "center "+fondProportionnel+"px");

                // On incrément alors le nombre de cartes visible, qui passe de 0 à 1.
                nbCartesVisibles++;


            /* Si une carte était déjà visible à ce moment là, on fait la même chose avec l'objet Carte2 (statut, classe, fond)
            Puis on va les comparer
            */    
            }else if(nbCartesVisibles==1){

                Carte2=objCarte;
                Carte2.status = "visible";

                $(idCarte).removeClass("masquee").addClass("visible");

                var fond = -(Carte2.fruit)*100;
                var fondProportionnel = ($(idCarte).width())*fond/100; // décalage proportionnel à la taille de la carte
                $(idCarte).css("background-position", "center "+fondProportionnel+"px");

                // Le nombre de cartes visibles passe de 1 à 2
                nbCartesVisibles++;

                // Comparaison des cartes
                if(Carte1.fruit==Carte2.fruit){
                    
                    // Si les fruits des 2 cartes sont identiques, on lance la fonction réussi()
                    reussi(Carte1,Carte2);

                }else{

                    // Sinon, on lance la foncton rate(), mais avec un délai d'1s, pour que le joueur puisse voir la 2ème carte
                    setTimeout(function(){ rate(Carte1,Carte2); }, 1000);
                    ;
                }

            }

        }

    }



    // Fonction appelée si le joueur a retourné 2 cartes, et que les fruits correspondent

    function reussi(obj1, obj2){

        /* On récupère les deux objets carte en question, on leur passe le statut et la classe validee
        Avec ce statut, ces cartes ne pourront plus jamais lancer la fonction verification() si le joueur clique dessus
        */
        Carte1 = obj1;
        Carte1.status = "validee";
        $(Carte1.id).removeClass("visible").addClass("validee");

        Carte2 = obj2;
        Carte2.status = "validee";
        $(Carte2.id).removeClass("visible").addClass("validee");

        // On repasse le nombre de cartes visible à 0, et on vide les objets Carte1 et Carte2
        nbCartesVisibles=0;
        Carte1 = "";
        Carte2 = "";

        // On incrémente le nombre de paires validées. Si toutes les paires sont validées, on lance la fonction gagne()
        pairesValidees ++;
        if(pairesValidees==(nbCartes/2)){
            gagne();
        }
    }



    // Fonction appelée si le joueur a retourné 2 cartes, et que les fruits ne correspondent pas

    function rate(obj1, obj2){

        /* On récupère les deux objets carte en question, on leur repasse le statut et la classe masquee
        Attention : on supprime aussi leur style de background ! Sinon, il sera encore visible dans le code HTML,
        et le joueur pourrait s'en servir pour retrouver telle carte ou tel fruit
        */
        Carte1 = obj1;
        Carte1.status = "masquee";
        $(Carte1.id).removeClass("visible").addClass("masquee");
        $(Carte1.id).removeAttr('style');

        Carte2 = obj2;
        Carte2.status = "masquee";
        $(Carte2.id).removeClass("visible").addClass("masquee");
        $(Carte2.id).removeAttr('style');

        // On repasse le nombre de cartes visible à 0, et on vide les objets Carte1 et Carte2
        nbCartesVisibles=0;
        Carte1 = "";
        Carte2 = "";
    }

    

    // Fonction de départ du chrono

    function lancerChrono(){

        // On affiche le chrono pour le joueur
        $('#temps').text(tempsEcoule);

        /* La ligne ci-dessous signifie qu'à partir de maintenant, l'objet timer lance la fonctione chronometre()
        toutes les 10 millièmes de s (toutes les 0.01s)
        */
        timer = setInterval(chronometre, 10);
    }



    // Fonction appelée toutes les 0.01s par l'objet timer quand le chrono est activé

    function chronometre(){

        // le temps écoulé est incrémenté de 0.01 . Il correspondra donc au temps en seconde.
        tempsEcoule += 0.01

        // On affiche au joueur la variable tempsAffiche, qui est simplement la variable tempsEcoule arrondie à 2 chiffres après la virgule 
        tempsAffiche = (Math.round(tempsEcoule*100))/100;
        $('#temps').text(tempsAffiche);

        /* On calcule ici le pourcentage de temps restant, pour l'appliquer à la jauge du timer.
        Pour ça, on fait un produit en croix avec le temps écoulé et la durée initiale du chrono, puis on soustrait à 100
        pour avoir le temps restant
        */
        pourcentageTempsRestant = 100-((tempsEcoule*100)/dureeChrono);
        $('#barreProgression').width(pourcentageTempsRestant+"%");

        // Si le temps écoulé dépasse le temps imparti, on arrête le chrono et la partie est perdue. On lance les fonctions correspondantes
        if(tempsEcoule >= dureeChrono){
            arreterChrono();
            perdu();
        }
    }



    // Fonction d'arrêt du chrono

    function arreterChrono(){

        // on stoppe l'action de l'objet timer et on le réinitialise. Il arrête donc de lancer la fonction chronometre() toutes les 0.01s
        clearInterval(timer);
        timer = null;

        // on réinitialise les variables de temps pour une prochaine partie, et on supprime l'affiche du temps pour le joueur
        tempsEcoule = 0;
        tempsAffiche = 0;
        $('#temps').text("");
    }



    // Fonction appelée si la partie est gagnée (youpi !)

    function gagne(){

        /* On récupère le score du joueur (son temps) et on l'affiche, on arrête le chronomètre, et partieGagnee passe à true */
        scoreJoueur = tempsAffiche;
        $('#scoreJoueur').text("Score : "+scoreJoueur);

        arreterChrono();
        partieGagnee = true;

        // On change aussi le texte du bouton en "rejouer" pour plus de cohérence
        $('#rejouer').text('Rejouer');

        // on affiche l'encart de victoire, avec la sauvegarde de score
        $('#encart_victoire').css("display", "block");
    }



    // Fonction appelée si la partie est perdue (snif), par la fonction finDuChrono

    function perdu(){

        /* On réinitialise les variables de jeu
        On ne touche à rien au niveau du chronomètre, tout a déjà été réinitialisé (vu que cette fonction est appelée après l'arrêt du chrono)
        */
        nbCartesVisibles = 0;
        Carte1 = "";
        Carte2 = "";
        pairesValidees = 0;
        nbClic = 0;

        // On enlève toutes les cartes du plateau pour éviter que le joueur continue quand même
        $('.carte').remove();

        // On change aussi le texte du bouton en "rejouer" pour plus de cohérence
        $('#rejouer').text('Rejouer');

        // on affiche l'encart de défaite
        $('#encart_defaite').css("display", "block");
    }



    // Fonction permettant de lancer/relancer une partie

    function rejouer(){

        // On réinitialise les variables de jeu
        nbCartesVisibles = 0;
        Carte1 = "";
        Carte2 = "";
        pairesValidees = 0;
        nbClic = 0;
        partieGagnee = false;
        scoreJoueur = 0;
        $('#scoreJoueur').text("");

        // On arrête le chrono s'il était en route (si le joueur relance une partie alors qu'il était déjà dans une partie)
        arreterChrono();

        // on masque les encarts de victoire ou de défaite s'ils étaient affichés
        $('#encart_victoire').removeAttr('style');
        $("#felicitations").text("");
        $('#encart_defaite').removeAttr('style');

        // On supprimer les cartes du plateau et on le génère à nouveau
        $('.carte').remove();
        generer_plateau();
    }



    // Fonction affichant les 5 meilleurs scores

    function afficherScores(){

        /* Petit bout de code, mais moins simple qu'il n'en a l'air.
        Ici, on utilise AJAX pour afficher dynamiquement le résultat du fichier PHP meilleursscores.php dans la div #affichageScores
        Le tout se fait grâce à la méthode load() de jQuery, utile ici car on n'a pas besoin d'envoyer de variables pour notre demande
        */
         $("#affichageScores").load('php/meilleursscores.php');
    }



    // Fonction permettant de sauvegarder son score

    function sauvegarderScore(joueur,score){

        /* Là encore, de l'AJAX, via jQuery et la fonction $.post
        En gros, ce bout de code va prendre des variables javascfipt et avec, va faire une requête côté serveur
        (grâce à un script PHP) directement, sans recharger la page
        Notre requête sera d'enregistrer le pseudo du joueur et son score dans une base de données
        */

        $.post(

            // on donne ici le fichier PHP contenant notre script (qui va faire l'inscription dans la BdD)
            'php/sauvegarderscore.php',
            {
                // on récupère les variables javascript données en argument de la fonction
                pseudoJoueur : joueur,
                scoreJoueur : score
            },

            function(data){ // Cette fonction sera lancée lors de la réponse du serveur

                if(data=="ok"){

                    // Ici, PHP a renvoyé "ok" via AJAX, tout s'est bien passé et l'inscription a eu lieu. On l'affiche pour le joueur
                    $("#felicitations").text("Félicitations ! Ton score a bien été ajouté !");

                    /* On prend garde à réinitialiser immédiatement le score du joueur pour éviter qu'il relance le formulaire
                    plusieurs fois avec le même score
                    */
                    scoreJoueur = 0;
                    $('#scoreJoueur').text("Score : ");

                }else{
                    // Ici, PHP n'a pas renvoyé "ok", un problème a eu lieu, on informe le joueur grâce à la variable data qui contient "erreur"
                    $("#felicitations").html(data);

                }
            },

            'text' // Notre script PHP nous renverra soit "ok", si tout s'est bien passé, soit "erreur". On choisit le format texte
         );

    }



    // Fonction permettant d'afficher le tableau de score s'il est masqué (en responsive)
    // ou de l'enlever s'il est affiché

    function afficherMasquerScore(){

        if($('#tableauScores').hasClass("tableau_cache")){

            $('#tableauScores').removeClass("tableau_cache").addClass("tableau_visible");

        }else if($('#tableauScores').hasClass("tableau_visible")){

            $('#tableauScores').removeClass("tableau_visible").addClass("tableau_cache");
        }

    }



    // Fonction permettant d'uniquement masquer le tableau des scores s'il est affiché

    function masquerScore(){

        if($('#tableauScores').hasClass("tableau_visible")){

            $('#tableauScores').removeClass("tableau_visible").addClass("tableau_cache");
        }

    }










    //////////////////////////////////////////////////////////////////////////////////////
    // EVENEMENTS ////////////////////////////////////////////////////////////////////////
    // Ici, on va déclarer tous les évènements qui vont avoir une action sur le jeu




    // Dès que la page est chargée, on affiche les meilleurs scores, sans action du joueur
    afficherScores();



    // L'évènement le plus important du jeu : on lance la fonction verification() dès que le joueur clique sur une carte

    $('.plateau').on('click', '.carte', function(){

        verification($(this).attr('id'));

        // si on est en responsive et que le tableau des scores est affiché, on le vire
        masquerScore();

    });



    // On lance ou relance une partie avec la fonction rejouer() quand le joueur clique sur le bouton "Rejouer"
    // On change aussi le texte du bouton en "relancer" pour plus de cohérence

    $('#rejouer').click(function(){

        $('#rejouer').text('Relancer');
        rejouer();

        // si on est en responsive et que le tableau des scores est affiché, on le vire
        masquerScore();

    });



    // On lance la fonction de switch du tableau des scores lorsqu'on clique sur "meilleurs scores"

    $('#btnMeilleursScores').click(function(){
        afficherMasquerScore();
    });



    // On lance la fonction d'enregistrement du score quand le joueur clique sur "Sauvegarder"

    $('.formulaire').on('click', '#envoi', function(e){

        /* attention, ici, on veut traiter la requête en AJAX, donc on doit d'abord empêcher le bouton de se rediriger vers une autre page
        On empêche donc son action par défaut
        */
        e.preventDefault();

        // si on est en responsive et que le tableau des scores est affiché, on le vire
        masquerScore();

        //on récupère ce que le joueur a rentré dans le formulaire
        var pseudoJoueur = $('#pseudoJoueur').val();

        if(partieGagnee==true){ // on vérifie que la partie est gagnée à cet instant

            if(scoreJoueur != 0){ // on vérifie ensuite que le score est valide (pour empêcher les multiples inscriptions)

                if(pseudoJoueur != ""){ // on vérifie que le joueur a bien tapé son pseudo

                    /* On effecture une  vérification par expression régulière que le joueur n'a pas mis
                    de caractères spéciaux dans le formulaire, avec la fonction test()
                    Le joueur ne peut renseigner que des lettres (majuscules, minuscules, accentuées etc.), des chiffres et des espaces
                    */
                    var regex = new RegExp("^[a-zA-ZÀ-ÿ0-9\\s]*$");

                    if(regex.test(pseudoJoueur)){

                        // On lance alors la fonction, puis on rafraîchit la liste des scores
                        sauvegarderScore(pseudoJoueur,scoreJoueur);
                        afficherScores();
    
                    }else{ $("#felicitations").text("Le pseudo contient des caractères interdits. Utilisez uniquement chiffres, lettres et espaces."); } // si pseudo contient des caractères spéciaux                   

                }else{ $("#felicitations").text("Le nom du pseudo n'est pas renseigné"); } // si le nom du joueur n'est pas renseigné
                
            }else{ $("#felicitations").text("Vous n'avez pas de score"); } // si le score n'est pas valide
            
        }else{ $("#felicitations").text("La partie n'est pas gagnée."); } // si la partie n'est pas gagnée
        

    });
    
});


    
