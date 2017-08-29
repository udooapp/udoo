--
--Categories table
--
CREATE TABLE `categories` (
  `CID` int(11) NOT NULL,
  `name` varchar(60) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

ALTER TABLE `categories`
  ADD PRIMARY KEY (`CID`),
  ADD UNIQUE KEY `name` (`name`);
  
 ALTER TABLE `categories`
  MODIFY `CID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
  
INSERT INTO `categories` (`CID`, `name`) VALUES
(1, 'Service 1'),
(2, 'Service 2'),
(3, 'Service 3'),
(4, 'Service 4'),
(5, 'Service 5'),
(6, 'Service 6'),
(7, 'Service 7'),
(8, 'Service 8'),
(9, 'Service 9'),
(10, 'Service 10');


--
--Users table
--

CREATE TABLE `users` (
  `uid` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `password` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `picture` varchar(400) DEFAULT NULL,
  `type` int(11) NOT NULL,
  `stars` float DEFAULT NULL,
  `birthdate` date DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

ALTER TABLE `users`
  ADD PRIMARY KEY (`uid`);
  
ALTER TABLE `users`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
  
ALTER TABLE `users` CHANGE `picture` `picture` LONGTEXT CHARACTER SET utf8 COLLATE utf8_german2_ci NULL DEFAULT NULL;

ALTER TABLE `users` ADD `language` VARCHAR(5) NOT NULL;

ALTER TABLE `users` ADD `active` INT NOT NULL AFTER `language`; 

ALTER TABLE `users` ADD `facebookid` BIGINT(11) NOT NULL AFTER `active`;
ALTER TABLE `users` ADD `googleid` VARCHAR(32) NOT NULL AFTER `facebookid`;

--
--Offer table
--
  
 CREATE TABLE `offer` (
  `sid` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text,
  `location` text NOT NULL,
  `expirydate` date DEFAULT NULL,
  `category` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

ALTER TABLE `offer`
  ADD PRIMARY KEY (`sid`),
  ADD KEY `uid` (`uid`);
  
ALTER TABLE `offer`
  MODIFY `sid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;  

 
ALTER TABLE `offer` ADD `realtime` BOOLEAN NOT NULL AFTER `category`;
 
--
--Request table
-- 
  
  
CREATE TABLE `request` (
  `rid` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text,
  `location` text NOT NULL,
  `jobdate` varchar(100) NOT NULL,
  `expirydate` date DEFAULT NULL,
  `category` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

ALTER TABLE `request`
  MODIFY `rid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
  
ALTER TABLE `request`
  ADD PRIMARY KEY (`rid`),
  ADD KEY `uid` (`uid`);

--
--PicturesOffer table
--  
  
CREATE TABLE `picturesoffer` (
  `poid` int(11) NOT NULL,
  `sid` int(11) NOT NULL,
  `scr` varchar(400) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

ALTER TABLE `picturesoffer`
  ADD PRIMARY KEY (`poid`),
  ADD KEY `sid` (`sid`);
  
ALTER TABLE `picturesoffer`
  MODIFY `poid` int(11) NOT NULL AUTO_INCREMENT;

 ALTER TABLE `picturesoffer` CHANGE `scr` `scr` LONGTEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
 
 ALTER TABLE `picturesoffer` CHANGE `scr` `src` LONGTEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
--
--PictureRequest table
--
  
CREATE TABLE `picturesrequest` (
  `prid` int(11) NOT NULL,
  `rid` int(11) NOT NULL,
  `scr` varchar(400) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

ALTER TABLE `picturesrequest`
  ADD PRIMARY KEY (`prid`),
  ADD KEY `rid` (`rid`);
  
ALTER TABLE `picturesrequest`
  MODIFY `prid` int(11) NOT NULL AUTO_INCREMENT;
  
ALTER TABLE `picturesrequest` CHANGE `scr` `scr` LONGTEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;

ALTER TABLE `picturesrequest` CHANGE `scr` `src` LONGTEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;
--
-- Contacts TABLE
--

CREATE TABLE contacts(
	uid INT NOT NUll,
    cid INT NOT NULL,
	PRIMARY KEY (uid, cid),
	CONSTRAINT FOREIGN KEY (uid) REFERENCES users (uid),
	CONSTRAINT FOREIGN KEY (cid) REFERENCES users (uid)
);


--
--Verification table
--

CREATE TABLE Verification(
	VID INT NOT NUll AUTO_INCREMENT,
    UID INT NOT NULL,
    Token VARCHAR(500) NOT NULL,
    expirydate DATE NOT NULL,
    PRIMARY KEY (VID),
    CONSTRAINT FOREIGN KEY (uid) REFERENCES users (uid)
);

ALTER TABLE `verification` ADD `type` BOOLEAN NOT NULL AFTER `expirydate`;

--
--Token Table
--

CREATE TABLE tokens(
	token VARCHAR(256) NOT NULL,
	expirydate DATE NOT NULL,
	uid INT,
	disable BOOLEAN NOT NULL,
	PRIMARY KEY (token),
	CONSTRAINT FOREIGN KEY (uid) REFERENCES users (uid)
);

--
--Comments Table 
--

CREATE TABLE Comments(
  cid INT AUTO_INCREMENT,
  uid INT NOT NULL,
  sid INT NOT NULL,
  type BOOLEAN NOT NULL,
  creatingdate DATETIME NOT NULL,
  comment text NOT NULL,
  PRIMARY KEY(cid),
  CONSTRAINT FOREIGN KEY (uid) REFERENCES Users (uid),
  CONSTRAINT FOREIGN KEY (sid) REFERENCES Offer (oid),
  CONSTRAINT FOREIGN KEY (sid) REFERENCES Request (rid)
);


--
--Bids Table
--

CREATE TABLE BIDS(
  bid INT AUTO_INCREMENT,
  uid INT NOT NULL,
  sid INT NOT NULL,
  type BOOLEAN NOT NULL,
  price DOUBLE NOT NULL,
  accepted BOOLEAN,
  description text,
  PRIMARY KEY(bid),
  CONSTRAINT FOREIGN KEY (uid) REFERENCES Users (uid),
  CONSTRAINT FOREIGN KEY (sid) REFERENCES Offer (oid),
  CONSTRAINT FOREIGN KEY (sid) REFERENCES Request (rid)
);

--
--Payments Table
--

CREATE TABLE Payments(
	pid int AUTO_INCREMENT,
  date DATETIME not null,
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


--
--Notification Table
--

CREATE TABLE Notifications(
  nid INT NOT NULL AUTO_INCREMENT,
  uid INT NOT NULL,
  type INT NOT NULL,
  id INT NOT NULL,
  checked BOOLEAN,
  PRIMARY KEY (nid),
  CONSTRAINT FOREIGN KEY (uid) REFERENCES Users (uid)
)

--
--Messager Tables
--

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

--
--Record History tables
--


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
 beforeState text,
 afterState text,
 hid int not null,
 Primary Key(heid),
 Constraint foreign key (hid) REFERENCES History(hid)
);


--
--Bookmarks Table
--

CREATE TABLE BOOKMARKS(
  uid INT NOT NULL,
  sid INT NOT NULL,
  type BOOLEAN NOT NULL,
  PRIMARY KEY(uid, sid, type),
  CONSTRAINT FOREIGN KEY (uid) REFERENCES Users (uid),
  CONSTRAINT FOREIGN KEY (sid) REFERENCES Offer (oid),
  CONSTRAINT FOREIGN KEY (sid) REFERENCES Request (rid)
);

--
--Availability Table
--

CREATE TABLE Availability(
	oid INT NOT NULL,
	day INT NOT NULL,
	`from` INT NOT NULL,
	`to` INT NOT NULL,
	PRIMARY KEY (oid, day, `from`, `to`),
  CONSTRAINT FOREIGN KEY (oid) REFERENCES Offer (oid)
);

--
--Reminder Tables
--
CREATE TABLE reminders(
	rid INT NOT NULL AUTO_INCREMENT,
	expirydate DATE NOT NULL,
	uid INT,
	token VARCHAR(512) NOT NULL,
	PRIMARY KEY (rid),
	CONSTRAINT FOREIGN KEY (uid) REFERENCES users (uid)
);