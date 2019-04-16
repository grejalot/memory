<?php

require_once 'config.php'; 






// Récupération de la liste des 5 meilleurs scores
/*
function meilleursScores(){

    $bdd=PDOconnexion::connexionBase();

    $meilleursJoueurs = $bdd->query('SELECT nom,score FROM score_memory ORDER BY score ASC LIMIT 0,5');

    while ($joueur = $meilleursJoueurs->fetch()){
        echo $joueur['nom']." : ".$joueur['score'].'<br />';
    }

    $meilleursJoueurs->closeCursor(); // Termine le traitement de la requête

}
*/



// Insertion du résultat après la victoire

function sauvegarderScore($joueurActuel, $scoreJoueurActuel){

    $bdd=PDOconnexion::connexionBase();

    $ajoutJoueur = $bdd->prepare('INSERT INTO score_memory(nom, score) VALUES(:nom, :score)');
    $ajoutJoueur->execute(array(
        'nom' => $joueurActuel,
        'score' => $scoreJoueurActuel
        ));

    echo 'Le jeu a bien été ajouté !';

}

//sauvegarderScore('test8', 251.08);


?>