CREATE TABLE Conversations(
	cid INT AUTO_INCREMENT,
	lastDate DATETIME,
	lastMessage TEXT,
	PRIMARY KEY (cid)
);
CREATE TABLE UserConversations(
	ucid INT AUTO_INCREMENT,
	cid INT NOT NULL,
	uid INT NOT NULL,
	fromId int NOT NULL,
	checked BOOLEAN NOT NULL,
	PRIMARY KEY (ucid),
	CONSTRAINT FOREIGN KEY (cid) REFERENCES Conversations (cid),
	CONSTRAINT FOREIGN KEY (fromId) REFERENCES users (uid),
	CONSTRAINT FOREIGN KEY (uid) REFERENCES users (uid)
);
CREATE TABLE Messages(
  mid INT AUTO_INCREMENT,
  message TEXT NOT NULL,
  ucid int not null,
  date DATETIME NOT NULL,
  PRIMARY KEY(mid),
  CONSTRAINT FOREIGN KEY (ucid) REFERENCES UserConversations (ucid)
);