Create TABLE UserHistory(
	UHID int AUTO_INCREMENT,
	date DATETIME not null,
	uid int not null,
	action int,
    PRIMARY KEY (UHID),
	CONSTRAINT FOREIGN KEY (uid) REFERENCES users (uid)
);
Create TABLE OfferHistory(
	OHID int AUTO_INCREMENT,
	date DATETIME not null,
	oid int not null,
	action int,
	changes text,
    PRIMARY KEY (OHID),
	CONSTRAINT FOREIGN KEY (oid) REFERENCES Offer (oid)
);
Create Table RequestHistory(
	RHID int AUTO_INCREMENT,
	date DATETIME not null,
	rid int not null,
	action int,
	changes text,
    PRIMARY KEY (RHID),
	CONSTRAINT FOREIGN KEY (rid) REFERENCES Request (rid)
)