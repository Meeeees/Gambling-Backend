-- User Table
CREATE TABLE User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    balance DECIMAL(10, 2) NOT NULL DEFAULT 0
);

-- Payment Table
CREATE TABLE Payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    amount DECIMAL(10, 2) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

-- Transaction Table
CREATE TABLE Transaction (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    amount DECIMAL(10, 2) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type VARCHAR(50),
    description VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

-- Game Table
CREATE TABLE Game (
    game_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    min_bet DECIMAL(10, 2) NOT NULL,
    max_bet DECIMAL(10, 2) NOT NULL
);

-- User_Game Table
CREATE TABLE User_Game (
    user_game_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    game_id INT,
    bet_amount DECIMAL(10, 2) NOT NULL,
    result VARCHAR(50),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (game_id) REFERENCES Game(game_id)
);
