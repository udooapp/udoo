CREATE TABLE tokens(
	token VARCHAR(256) NOT NULL,
	expirydate DATE NOT NULL,
	uid INT,
	disable BOOLEAN NOT NULL,
	PRIMARY KEY (token),
	CONSTRAINT FOREIGN KEY (uid) REFERENCES users (uid)
);