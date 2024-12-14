DROP DATABASE IF EXISTS DotsAndBoxes;
CREATE DATABASE DotsAndBoxes;
USE DotsAndBoxes;

-- drop tables if they already exist
DROP TABLE IF EXISTS Player;
DROP TABLE IF EXISTS Game;
DROP TABLE IF EXISTS Chat;
DROP TABLE IF EXISTS Message;

-- create player table
CREATE TABLE `Player` (
    `idPlayer` INT AUTO_INCREMENT,
    `username` VARCHAR(25) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `inGame` INT NOT NULL DEFAULT 0,  -- 0 = not in game, 1 = in game
    `onlineStatus` TINYINT NOT NULL DEFAULT 0,  -- 0 = offline, 1 = online
    PRIMARY KEY (`idPlayer`)
);

-- create game table 
CREATE TABLE `Game` (
    `idGame` INT AUTO_INCREMENT,
    `idPlayer1` INT NOT NULL,
    `idPlayer2` INT NOT NULL,
    `gameBoard` JSON,          -- the game board state
    `gameState` INT NOT NULL,  -- game state: 0 = in progress, 1 = finished
    `currentTurn` INT NOT NULL DEFAULT 1,  -- 1 or 2
    `winner` INT,              -- if game is finished
    PRIMARY KEY (`idGame`),
    FOREIGN KEY (`idPlayer1`) REFERENCES Player(idPlayer),
    FOREIGN KEY (`idPlayer2`) REFERENCES Player(idPlayer)
);

-- create chat table 
CREATE TABLE `Chat` (
    `idChat` INT AUTO_INCREMENT,
    `idGame` INT,
    `timeStamp` DATETIME NOT NULL,
    PRIMARY KEY (`idChat`),
    FOREIGN KEY (`idGame`) REFERENCES Game(idGame)
);

-- create message table
CREATE TABLE `Message` (
    `idMessage` INT AUTO_INCREMENT,
    `idAuthor` INT NOT NULL,
    `timeStamp` DATETIME NOT NULL,
    `chatRoom` INT NOT NULL,
    `content` VARCHAR(200) NOT NULL,
    PRIMARY KEY (`idMessage`),
    FOREIGN KEY (`idAuthor`) REFERENCES Player(idPlayer),
    FOREIGN KEY (`chatRoom`) REFERENCES Chat(idChat)
);