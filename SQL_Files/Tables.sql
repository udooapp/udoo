-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 03 Mai 2017 la 13:04
-- Versiune server: 5.7.14
-- PHP Version: 5.6.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `udoo`
--

-- --------------------------------------------------------

--
-- Structura de tabel pentru tabelul `categories`
--

CREATE TABLE `categories` (
  `CID` int(11) NOT NULL,
  `name` varchar(60) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Salvarea datelor din tabel `categories`
--

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

-- --------------------------------------------------------

--
-- Structura de tabel pentru tabelul `offer`
--

CREATE TABLE `offer` (
  `sid` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text,
  `location` text NOT NULL,
  `availability` varchar(100) NOT NULL,
  `expirydate` date DEFAULT NULL,
  `category` int(11) NOT NULL,
  `image` text
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Salvarea datelor din tabel `offer`
--

INSERT INTO `offer` (`sid`, `uid`, `title`, `description`, `location`, `availability`, `expirydate`, `category`, `image`) VALUES
(1, 1, 'Washing Centre', 'Wash everything...', '{"coordinate":{"lat":48.2203445, "lng": 16.0998799}, "address":"adsadasfa"}', '8:00-20:00', '2017-04-26', 1, NULL),
(2, 1, 'Valami', 'dsasdsada', '{"coordinate":{"lat":48.2203445, "lng": 16.0998699}, "address":"asdasdasdasd"}', 'asdsda', NULL, 5, NULL),
(3, 5, 'Udoo offer', 'Udoo bvest service...', '{"coordinate":{"lat":48.20870810801371,"lng":16.37498064468673},"address":"Strobelgasse 1, 1010 Wien, Austria"}', 'asdasdasdas', NULL, 0, NULL),
(4, 5, 'asdasd', 'asdasd', '{"coordinate":{"lat":48.210252463543945,"lng":16.36948748062423},"address":"Tuchlauben 7A, 1010 Wien, Austria"}', 'asdasd', NULL, 1, ''),
(5, 5, 'adasd', 'asdasdas', '{"coordinate":{"lat":48.21328384081518,"lng":16.36674089859298},"address":"Hohenstaufengasse 4, 1010 Wien, Austria"}', 'asdasda', NULL, 1, '');

-- --------------------------------------------------------

--
-- Structura de tabel pentru tabelul `picturesoffer`
--

CREATE TABLE `picturesoffer` (
  `poid` int(11) NOT NULL,
  `sid` int(11) NOT NULL,
  `scr` varchar(400) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structura de tabel pentru tabelul `picturesrequest`
--

CREATE TABLE `picturesrequest` (
  `prid` int(11) NOT NULL,
  `rid` int(11) NOT NULL,
  `scr` varchar(400) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structura de tabel pentru tabelul `request`
--

CREATE TABLE `request` (
  `rid` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text,
  `location` text NOT NULL,
  `jobdate` varchar(100) NOT NULL,
  `expirydate` date DEFAULT NULL,
  `category` int(11) NOT NULL,
  `image` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Salvarea datelor din tabel `request`
--

INSERT INTO `request` (`rid`, `uid`, `title`, `description`, `location`, `jobdate`, `expirydate`, `category`, `image`) VALUES
(1, 1, 'DishWash', 'asdadasd sad a', '{"coordinate": {"lat":48.2103445, "lng": 16.3798799}, "address":"service 1"}', '2017/09/23', '2017-10-25', 4, ''),
(2, 1, 'DishWash', '', '{"coordinate":{"lat":48.2103442, "lng": 16.3798780}, "address":"ASDAS"}', '2017/09/23', '2017-10-25', 3, ''),
(3, 1, 'sadsd', 'asdsadasd das dsad ;sa', '{"coordinate":{"lat":48.2103435, "lng": 16.3798779}, "address":"asdasdasd"}', '', NULL, 3, ''),
(4, 1, 'sadsad', 'sadasdsad', '{"coordinate":\r\n {"lat":48.22340352534794,"lng":16.39409065246582}, "address":"asdasdas"}', '2017-01-01', NULL, 2, ''),
(5, 1, 'asdsad', 'asdsadsadsada', '{"coordinate":\r\n {"lat":48.209449020405714,"lng":16.38636589050293}, "address":"asdasdasd"}', '2018-02-02', NULL, 1, ''),
(6, 5, 'asdasd', 'asdasdsa', '{"coordinate":{"lat":48.208879705372496,"lng":16.371633247836144},"address":"Jasomirgottstraße 3, 1010 Wien, Austria"}', '2017-01-01', NULL, 1, ''),
(7, 5, 'asdasd', 'asdasdsa', '{"coordinate":{"lat":48.208879705372496,"lng":16.371633247836144},"address":"Jasomirgottstraße 3, 1010 Wien, Austria"}', '2017-01-01', NULL, 1, ''),
(8, 5, 'Udoo request', 'asdsadasdasdas', '{"coordinate":{"lat":48.21242592205875,"lng":16.368028358920128},"address":"Tiefer Graben 19, 1010 Wien, Austria"}', '2017-01-01', NULL, 2, ''),
(9, 5, 'asdasd', 'asdasdsa', '{"coordinate":{"lat":48.20899410329228,"lng":16.372834877474816},"address":"Stephansplatz 8, 1010 Wien, Austria"}', '2017-01-01', NULL, 1, ''),
(10, 5, 'azsxdczz', 'zxczxc', '{"coordinate":{"lat":48.211739576704346,"lng":16.36699839065841},"address":"Tiefer Graben 7, 1010 Wien, Austria"}', '2017-03-01', NULL, 1, ''),
(11, 5, 'UdooService', 'The best Service on the world', '{"coordinate":{"lat":48.21060084723258,"lng":16.37642416082599},"address":"Fleischmarkt 14, 1010 Wien, Austria"}', '2017-01-01', NULL, 2, 'icon.png');

-- --------------------------------------------------------

--
-- Structura de tabel pentru tabelul `users`
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

--
-- Salvarea datelor din tabel `users`
--

INSERT INTO `users` (`uid`, `name`, `password`, `email`, `phone`, `picture`, `type`, `stars`, `birthdate`) VALUES
(2, 'Washing Inc.', 'password', 'washingMachineCorp@washing.com', '0123456789', 'Orarend2.png', 1, 3, '2017-04-03'),
(1, 'John Doe', 'password4', 'JohnDoe@email.com', '9870654321', '', 1, 3.5, '2017-01-01'),
(4, 'firsttest lasttest', 'password', 'email@email.com', '01234567989', NULL, 1, 4.1, '2017-05-01'),
(5, 'Udoo', 'password1', 'udoo@udoo.com', '0751463764', 'profile.png', 0, 0, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`CID`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `offer`
--
ALTER TABLE `offer`
  ADD PRIMARY KEY (`sid`),
  ADD KEY `uid` (`uid`);

--
-- Indexes for table `picturesoffer`
--
ALTER TABLE `picturesoffer`
  ADD PRIMARY KEY (`poid`),
  ADD KEY `sid` (`sid`);

--
-- Indexes for table `picturesrequest`
--
ALTER TABLE `picturesrequest`
  ADD PRIMARY KEY (`prid`),
  ADD KEY `rid` (`rid`);

--
-- Indexes for table `request`
--
ALTER TABLE `request`
  ADD PRIMARY KEY (`rid`),
  ADD KEY `uid` (`uid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`uid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `CID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `offer`
--
ALTER TABLE `offer`
  MODIFY `sid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `picturesoffer`
--
ALTER TABLE `picturesoffer`
  MODIFY `poid` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `picturesrequest`
--
ALTER TABLE `picturesrequest`
  MODIFY `prid` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `request`
--
ALTER TABLE `request`
  MODIFY `rid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
