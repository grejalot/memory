<?php

require_once 'config.php'; 

// Récupération de la liste des 5 meilleurs scores

$bdd=PDOconnexion::connexionBase();

$meilleursJoueurs = $bdd->query('SELECT nom,score FROM score_memory ORDER BY score ASC LIMIT 0,5');

while ($joueur = $meilleursJoueurs->fetch()){
    echo $joueur['nom']." : ".$joueur['score'].'<br />';
}

$meilleursJoueurs->closeCursor(); // Termine le traitement de la requête


?>