<?php

// Ce fichier PHP a été appelé via AJAX pour sauvegarder le score du joueur après sa victoire

// tout d'abord, on récupère les informations de connexion à la base de données (variables et classe)
require_once 'config.php'; 

//on se connecte à la base grâce à la classe PDOConnexion. L'objet PHP &bdd contient maintenant notre base de données
$bdd=PDOconnexion::connexionBase();

// Insertion du résultat après la victoire
if(!empty($_POST['pseudoJoueur']) AND !empty($_POST['scoreJoueur'])){ // on refait une vérification de la validité des variables

    // On récupère nos variables
    $pseudoJoueur = $_POST['pseudoJoueur'];
    $scoreJoueur = $_POST['scoreJoueur'];

    // On construit notre requête et on l'exécute
    $ajoutJoueur = $bdd->prepare('INSERT INTO score_memory(nom, score) VALUES(:nom, :score)');
    $ajoutJoueur->execute(array(
        'nom' => $pseudoJoueur,
        'score' => $scoreJoueur
    ));

    // On signifie en retour de la requête AJAX que tout s'est bien passé
    echo 'ok';

}else{

    // Sinon, on leur fait savoir qu'il y a eu un problème.
    echo "erreur";
}


?>