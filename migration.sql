CREATE TABLE auth (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username CHAR(200) NOT NULL,
    password CHAR(200) NOT NULL,
    role INT NOT NULL,
    is_remove BOOLEAN DEFAULT FALSE
);

CREATE TABLE room (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name CHAR(200) NOT NULL
);

CREATE TABLE queue (
    id INT AUTO_INCREMENT PRIMARY KEY,
    auth_id INT NOT NULL,
    room_id INT NOT NULL,
    title CHAR(200) NOT NULL,
    detail CHAR(200) NOT NULL,
    status INT NOT NULL,
    date DATETIME NOT NULL,
    FOREIGN KEY (auth_id) REFERENCES auth(id),
    FOREIGN KEY (room_id) REFERENCES room(id)
);

CREATE TABLE file (
    id INT AUTO_INCREMENT PRIMARY KEY,
    queue_id INT NOT NULL,
    url CHAR(200),
    FOREIGN KEY (queue_id) REFERENCES queue(id)
);
