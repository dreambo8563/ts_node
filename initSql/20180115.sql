CREATE TABLE todo
(
  id          INT AUTO_INCREMENT
    PRIMARY KEY,
  name        VARCHAR(20)     NULL,
  description VARCHAR(255)    NULL,
  status      INT DEFAULT '1' NULL
)
  ENGINE = InnoDB;

