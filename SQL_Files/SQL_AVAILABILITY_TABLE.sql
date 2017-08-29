CREATE TABLE Availability(
	oid INT NOT NULL,
	day INT NOT NULL,
	`from` INT NOT NULL,
	`to` INT NOT NULL,
	PRIMARY KEY (oid, day, `from`, `to`),
  CONSTRAINT FOREIGN KEY (oid) REFERENCES Offer (oid)
);
ALTER TABLE Offer drop column availability;