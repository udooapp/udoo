--
-- Categories table
--
CREATE TABLE `categories` (
  `cid` int(11) NOT NULL,
  `name` varchar(60) DEFAULT NULL
);

ALTER TABLE `categories`
  ADD PRIMARY KEY (`cid`),
  ADD UNIQUE KEY `name` (`name`);
  
 ALTER TABLE `categories`
  MODIFY `cid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
  
INSERT INTO `categories` (`cid`, `name`) VALUES
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
-- Users table
--

CREATE TABLE `users` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `password` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `picture` LONGTEXT DEFAULT NULL,
  `type` int(11) NOT NULL,
  `stars` float DEFAULT NULL,
  `language` VARCHAR(5) NOT NULL,
  `birthdate` date DEFAULT NULL,
  `location` VARCHAR(200),
  `active` INT(2) NOT NULL,
   `facebookid` BIGINT(11) NOT NULL,
   `googleid` VARCHAR(32) NOT NULL,
  PRIMARY KEY(`uid`)
);

--
-- Offer table
--
  
 CREATE TABLE `offer` (
  `oid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text,
  `location` text NOT NULL,
  `expirydate` date DEFAULT NULL,
  `category` int(11) NOT NULL,
  `realtime` BOOLEAN NOT NULL,
  PRIMARY KEY (`oid`),
  CONSTRAINT FOREIGN KEY (`uid`) REFERENCES `users` (`uid`)
);
  
--
-- Request table
-- 
  
  
CREATE TABLE `request` (
  `rid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text,
  `location` text NOT NULL,
  `jobdate` varchar(100) NOT NULL,
  `expirydate` date DEFAULT NULL,
  `category` int(11) NOT NULL,
  PRIMARY KEY(`rid`),
  CONSTRAINT FOREIGN KEY (`uid`) REFERENCES `users` (`uid`)
);


--
-- PicturesOffer table
--  
  
CREATE TABLE `picturesoffer` (
  `poid` int(11) NOT NULL AUTO_INCREMENT,
  `oid` int(11) NOT NULL,
  `src` LONGTEXT DEFAULT NULL,
   PRIMARY KEY(`poid`),
   CONSTRAINT FOREIGN KEY (`oid`) REFERENCES `offer` (`oid`)
);

--
-- PictureRequest table
--
  
CREATE TABLE `picturesrequest` (
  `prid` int(11) NOT NULL AUTO_INCREMENT,
  `rid` int(11) NOT NULL,
  `src` LONGTEXT DEFAULT NULL,
  PRIMARY KEY(`prid`),
  CONSTRAINT FOREIGN KEY (`rid`) REFERENCES `request` (`rid`)
);

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
-- Verification table
--

CREATE TABLE verification(
	vid INT NOT NUll AUTO_INCREMENT,
  uid INT NOT NULL,
  token VARCHAR(500) NOT NULL,
  expirydate DATE NOT NULL,
	`type` BOOLEAN NOT NULL,
  PRIMARY KEY (VID),
  CONSTRAINT FOREIGN KEY (uid) REFERENCES users (uid)
);


--
-- Token Table
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
-- Comments Table 
--

CREATE TABLE comments(
  cid INT AUTO_INCREMENT,
  uid INT NOT NULL,
  sid INT NOT NULL,
  type BOOLEAN NOT NULL,
  creatingdate DATETIME NOT NULL,
  comment text NOT NULL,
  PRIMARY KEY(cid),
  CONSTRAINT FOREIGN KEY (uid) REFERENCES users (uid)
);


--
-- Bids Table
--

CREATE TABLE bids(
  bid INT AUTO_INCREMENT,
  uid INT NOT NULL,
  sid INT NOT NULL,
  type BOOLEAN NOT NULL,
  price DOUBLE NOT NULL,
  accepted BOOLEAN,
  description text,
  PRIMARY KEY(bid),
  CONSTRAINT FOREIGN KEY (uid) REFERENCES users (uid)
);

--
-- Payments Table
--

CREATE TABLE payments(
	pid int AUTO_INCREMENT,
  date DATETIME not null,
  uid int not null,
  sid int not null,
  type BOOLEAN not null,
  state int not null,
  price DOUBLE not null,
  PRIMARY KEY(pid),
  CONSTRAINT FOREIGN KEY (uid) REFERENCES users (uid)
);


--
-- Notification Table
--

CREATE TABLE notifications(
  nid INT NOT NULL AUTO_INCREMENT,
  uid INT NOT NULL,
  type INT NOT NULL,
  id INT NOT NULL,
  checked BOOLEAN,
  PRIMARY KEY (nid),
  CONSTRAINT FOREIGN KEY (uid) REFERENCES users (uid)
);

--
-- Messager Tables
--

CREATE TABLE conversations(
	cid INT AUTO_INCREMENT,
	lastDate DATETIME,
	lastMessage TEXT,
	PRIMARY KEY (cid)
);
CREATE TABLE userconversations(
	ucid INT AUTO_INCREMENT,
	cid INT NOT NULL,
	uid INT NOT NULL,
	fromId int NOT NULL,
	checked BOOLEAN NOT NULL,
	PRIMARY KEY (ucid),
	CONSTRAINT FOREIGN KEY (cid) REFERENCES conversations (cid),
	CONSTRAINT FOREIGN KEY (fromId) REFERENCES users (uid),
	CONSTRAINT FOREIGN KEY (uid) REFERENCES users (uid)
);
CREATE TABLE messages(
  mid INT AUTO_INCREMENT,
  message TEXT NOT NULL,
  ucid int not null,
  date DATETIME NOT NULL,
  PRIMARY KEY(mid),
  CONSTRAINT FOREIGN KEY (ucid) REFERENCES userconversations (ucid)
);

--
-- Record History tables
--


Create TABLE history(
	hid int AUTO_INCREMENT,
	date DATETIME not null,
	tid int not null,
  type int not null,
  PRIMARY KEY (hid)
);

Create Table historyelements(
 heid int AUTO_INCREMENT,
 action int,
 beforeState text,
 afterState text,
 hid int not null,
 Primary Key(heid),
 Constraint foreign key (hid) REFERENCES history(hid)
);


--
-- Bookmarks Table
--

CREATE TABLE bookmarks(
  uid INT NOT NULL,
  sid INT NOT NULL,
  type BOOLEAN NOT NULL,
  PRIMARY KEY(uid, sid, type),
  CONSTRAINT FOREIGN KEY (uid) REFERENCES users (uid)
);

--
-- Availability Table
--

CREATE TABLE availability(
	oid INT NOT NULL,
	day INT NOT NULL,
	`from` INT NOT NULL,
	`to` INT NOT NULL,
	PRIMARY KEY (oid, day, `from`, `to`),
  CONSTRAINT FOREIGN KEY (oid) REFERENCES offer (oid)
);

--
-- Reminder Tables
--
CREATE TABLE reminders(
	rid INT NOT NULL AUTO_INCREMENT,
	expirydate DATE NOT NULL,
	uid INT,
	token VARCHAR(512) NOT NULL,
	PRIMARY KEY (rid),
	CONSTRAINT FOREIGN KEY (uid) REFERENCES users (uid)
);