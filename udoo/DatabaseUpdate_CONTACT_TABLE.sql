CREATE TABLE contacts(
	uid INT NOT NUll,
    cid INT NOT NULL,
	PRIMARY KEY (uid, cid),
	CONSTRAINT FOREIGN KEY (uid) REFERENCES users (uid),
	CONSTRAINT FOREIGN KEY (cid) REFERENCES users (uid)
);