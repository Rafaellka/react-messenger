CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    userName VARCHAR(25) NOT NULL,
    passHash VARCHAR NOT NULL,
);

CREATE TABLE dialogs(
    id VARCHAR PRIMARY KEY,
    messages json
);