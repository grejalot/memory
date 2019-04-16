<?php

// Ce fichier PHP a été appelé via AJAX pour afficher les 5 meilleurs scores du jeu

// tout d'abord, on récupère les informations de connexion à la base de données (variables et classe)
require_once 'config.php'; 

//on se connecte à la base grâce à la classe PDOConnexion. L'objet PHP &bdd contient maintenant notre base de données
$bdd=PDOconnexion::connexionBase();

// On construit notre requête et on l'effectue, le résultat se place dans l'objet $meilleursJoueurs
$meilleursJoueurs = $bdd->query('SELECT nom,score FROM score_memory ORDER BY score ASC LIMIT 0,5');

/* Maintenant, on va afficher nos résultats
*/

/* On lance une boucle qui va parcourir une à une toutes les entrées de notre objet $meilleursJoueurs
Pour chaque entrée, on va extraire un tableau $joueur qui contient les valeurs des différents champs correspondant à l'entrée
*/
while ($joueur = $meilleursJoueurs->fetch()){

    //ici, on choisit d'afficher le contenu du champ "nom", puis celui du champ "score", de l'entrée en train d'être traitée par la boucle
    echo $joueur['nom']." : ".$joueur['score'].'<br />';
}

// Une fois la boucle terminée, on clôt le traitement de la requête
$meilleursJoueurs->closeCursor();

?>