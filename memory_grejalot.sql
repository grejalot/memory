-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le :  jeu. 18 avr. 2019 à 07:28
-- Version du serveur :  5.7.24
-- Version de PHP :  7.2.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `memory_grejalot`
--

-- --------------------------------------------------------

--
-- Structure de la table `score_memory`
--

DROP TABLE IF EXISTS `score_memory`;
CREATE TABLE IF NOT EXISTS `score_memory` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `nom` text NOT NULL,
  `score` decimal(10,2) NOT NULL DEFAULT '999.99',
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM AUTO_INCREMENT=51 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `score_memory`
--

INSERT INTO `score_memory` (`ID`, `nom`, `score`, `date`) VALUES
(49, 'Guillaume RÉJALOT', '87.54', '2019-04-17 13:56:04'),
(50, 'Marine', '63.79', '2019-04-18 09:26:36'),
(46, 'Un peu plus chaud', '80.00', '2019-04-17 13:52:40'),
(47, 'Ultra chaud', '50.00', '2019-04-17 13:53:38'),
(45, 'Facile à battre', '179.99', '2019-04-17 13:52:40');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
