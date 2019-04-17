<?php

// Cette page est appelée dans nos scripts PHP quand il faut se connecter à la base de données du site

// Dans un premier temps, on renseigne les paramères de connexion
// Pour ça, on utilise des constantes, des variables dont la valeur ne changera jamais


define('DB_HOST', 'localhost');     // Adresse de l’hébergement MySQL.
define('DB_NAME', 'memory_grejalot');        // Nom de la base de données de WordPress.
define('DB_LOGIN', 'root');         // Utilisateur de la base de données MySQL.
define('DB_PASSWORD', '');          // Mot de passe de la base de données MySQL.



// Classe de Connexion à la base de données
// Cette classe va permettre d'insérer la base de donnée dans un objet lorsqu'elle sera appelée

class PDOconnexion
{
    private static $_instance;

    /* à l'intérieur de la classe, on crée la fonction de connexion à la base. Cette fonction reprend les constantes du début de fichier
    et retourne un objet PDO
    */
    public static function connexionBase() {

        
        try { 
            static::$_instance = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset=utf8', DB_LOGIN, DB_PASSWORD);
        } catch (PDOException $e) {

            // si la création de l'objet a posé problème, catch nous renvoie une erreur $e qu'on affiche
            echo $e;
        }

        // si tout s'ets bien passé, la fonction retourne l'objet
        return static::$_instance;
    }
}

?>