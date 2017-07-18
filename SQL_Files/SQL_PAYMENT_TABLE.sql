CREATE TABLE Payments(
	pid int AUTO_INCREMENT,
  date Date not null,
  uid int not null,
  sid int not null,
  type BOOLEAN not null,
  state int not null,
  price DOUBLE not null,
  PRIMARY KEY(pid),
  CONSTRAINT FOREIGN KEY (uid) REFERENCES Users (uid),
  CONSTRAINT FOREIGN KEY (sid) REFERENCES Offer (oid),
  CONSTRAINT FOREIGN KEY (sid) REFERENCES Request (rid)
);