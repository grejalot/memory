<?php

require_once 'config.php'; 

// Insertion du résultat après la victoire

$bdd=PDOconnexion::connexionBase();

if(!empty($_POST['pseudoJoueur']) AND !empty($_POST['scoreJoueur'])){ // si les variables ne sont pas vides

    $pseudoJoueur = $_POST['pseudoJoueur'];
    $scoreJoueur = $_POST['scoreJoueur']; // on sécurise nos données

    $ajoutJoueur = $bdd->prepare('INSERT INTO score_memory(nom, score) VALUES(:nom, :score)');
    $ajoutJoueur->execute(array(
        'nom' => $pseudoJoueur,
        'score' => $scoreJoueur
        ));

    echo 'ok';

}else{
    echo "erreur";
}


?>