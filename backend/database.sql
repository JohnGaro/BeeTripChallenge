DROP TABLE IF EXISTS player;

CREATE TABLE player (
  id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  playerName varchar(32) NOT NULL
  playerLevel int NOT NULL
);

DROP TABLE IF EXISTS Points;

CREATE TABLE Points (
  id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  player_ID int NOT NULL,
  points int NOT NULL,
  FOREIGN KEY (player_ID) REFERENCES player(id)
);

