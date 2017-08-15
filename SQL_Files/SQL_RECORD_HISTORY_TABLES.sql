Create TABLE History(
	HID int AUTO_INCREMENT,
	date DATETIME not null,
	tid int not null,
  type int not null,
  PRIMARY KEY (HID),
	CONSTRAINT FOREIGN KEY (tid) REFERENCES users (uid),
  CONSTRAINT FOREIGN KEY (tid) REFERENCES Offer (oid),
  CONSTRAINT FOREIGN KEY (tid) REFERENCES Request (tid)
);
Create Table HistoryElements(
 heid int AUTO_INCREMENT,
 action int,
 before text,
 after text,
 hid int not null,
 Primary Key(heid),
 Constraint foreign key (hid) REFERENCES History(hid)
);