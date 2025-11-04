CREATE TABLE auth (
   id INT NOT NULL AUTO_INCREMENT,
   username VARCHAR(32) NOT NUll UNIQUE ,
   password VARCHAR(200) NOT NUll ,
   role INT NOT NUll  ,
   isRemove BOOL DEFAULT false,
   PRIMARY KEY(id)
    
);

CREATE TABLE queue (
  id INT NOT NULL AUTO_INCREMENT,
     auth_id int ,
     room int ,
     status int,
     date DATETIME ,
    FOREIGN KEY (auth_id) REFERENCES auth(id) ,
     PRIMARY KEY(id)
  );