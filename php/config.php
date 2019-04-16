<?php

/** Adresse de l’hébergement MySQL. */
define('DB_HOST', 'localhost');

/** Nom de la base de données de WordPress. */
define('DB_NAME', 'memory');

/** Utilisateur de la base de données MySQL. */
define('DB_LOGIN', 'root');


/** Mot de passe de la base de données MySQL. */
define('DB_PASSWORD', '');



// Classe de Connexion à la base de données

class PDOconnexion
{
    private static $_instance;
 
    public static function connexionBase() {
        try {
            static::$_instance = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset=utf8', DB_LOGIN, DB_PASSWORD);
        } catch (PDOException $e) {
            echo $e;
        }
        return static::$_instance;
    }
}

?>