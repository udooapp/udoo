Create TABLE UserHistory(
	UHID int AUTO_INCREMENT,
	date DATETIME not null,
	uid int not null,
  PRIMARY KEY (UHID),
	CONSTRAINT FOREIGN KEY (uid) REFERENCES users (uid)
);
Create Table UserHistoryElements(
 uheid int AUTO_INCREMENT,
 action int,
 changes text,
 uhid int not null,
 Primary Key(uheid),
 Constraint foreign key (uhid) REFERENCES UserHistroy(uhid)
);
Create TABLE OfferHistory(
	OHID int AUTO_INCREMENT,
	date DATETIME not null,
	oid int not null,
  PRIMARY KEY (OHID),
	CONSTRAINT FOREIGN KEY (oid) REFERENCES Offer (oid)
);
Create Table OfferHistoryElements(
 oheid int AUTO_INCREMENT,
 action int,
 changes text,
 ohid int not null,
 Primary Key(oheid),
 Constraint foreign key (ohid) REFERENCES OfferHistroy(ohid)
);
Create Table RequestHistory(
	RHID int AUTO_INCREMENT,
	date DATETIME not null,
	rid int not null,
  PRIMARY KEY (RHID),
	CONSTRAINT FOREIGN KEY (rid) REFERENCES Request (rid)
);
Create Table RequestHistoryElements(
 rheid int AUTO_INCREMENT,
 action int,
 changes text,
 rhid int not null,
 Primary Key(rheid),
 Constraint foreign key (rhid) REFERENCES RequestHistroy(rhid)
);