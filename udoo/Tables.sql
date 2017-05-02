-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 02, 2017 at 02:44 PM
-- Server version: 5.7.14
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
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `CID` int(11) NOT NULL,
  `name` varchar(60) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `categories`
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
-- Table structure for table `offer`
--

CREATE TABLE `offer` (
  `oid` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text,
  `location` varchar(100) NOT NULL,
  `availability` varchar(100) NOT NULL,
  `expirydate` date DEFAULT NULL,
  `category` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `offer`
--

INSERT INTO `offer` (`oid`, `uid`, `title`, `description`, `location`, `availability`, `expirydate`, `category`) VALUES
(1, 1, 'Washing Centre', 'Wash everything...', '{"coordinate":{"lat":48.2203445, "lng": 16.0998799}, "address":"adsadasfa"}', '8:00-20:00', '2017-04-26', 1),
(2, 1, 'Valami', 'dsasdsada', '{"coordinate":{"lat":48.2203445, "lng": 16.0998699}, "address":"asdasdasdasd"}', 'asdsda', NULL, 5);

-- --------------------------------------------------------

--
-- Table structure for table `picturesoffer`
--

CREATE TABLE `picturesoffer` (
  `poid` int(11) NOT NULL,
  `oid` int(11) NOT NULL,
  `scr` varchar(400) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `picturesrequest`
--

CREATE TABLE `picturesrequest` (
  `prid` int(11) NOT NULL,
  `rid` int(11) NOT NULL,
  `scr` varchar(400) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `request`
--

CREATE TABLE `request` (
  `rid` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text,
  `location` varchar(100) NOT NULL,
  `jobdate` varchar(100) NOT NULL,
  `expirydate` date DEFAULT NULL,
  `picture` text NOT NULL,
  `category` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `request`
--

INSERT INTO `request` (`rid`, `uid`, `title`, `description`, `location`, `jobdate`, `expirydate`, `picture`, `category`) VALUES
(1, 1, 'DishWash', 'asdadasd sad a', '{"coordinate": {"lat":48.2103445, "lng": 16.3798799}, "address":"service 1"}', '2017/09/23', '2017-10-25', '', 4),
(2, 1, 'DishWash', '', '{"coordinate":{"lat":48.2103442, "lng": 16.3798780}, "address":"ASDAS"}', '2017/09/23', '2017-10-25', '', 3),
(3, 1, 'sadsd', 'asdsadasd das dsad ;sa', '{"coordinate":{"lat":48.2103435, "lng": 16.3798779}, "address":"asdasdasd"}', '', NULL, '', 3),
(4, 1, 'sadsad', 'sadasdsad', '{"coordinate":\r\n {"lat":48.22340352534794,"lng":16.39409065246582}, "address":"asdasdas"}', '2017-01-01', NULL, '', 2),
(5, 1, 'asdsad', 'asdsadsadsada', '{"coordinate":\r\n {"lat":48.209449020405714,"lng":16.38636589050293}, "address":"asdasdasd"}', '2018-02-02', NULL, '', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
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
-- Dumping data for table `users`
--

INSERT INTO `users` (`uid`, `name`, `password`, `email`, `phone`, `picture`, `type`, `stars`, `birthdate`) VALUES
(2, 'Washing Inc.', 'password', 'washingMachineCorp@washing.com', '0123456789', 'Orarend2.png', 1, 3, '2017-04-03'),
(1, 'John Doe', 'password4', 'JohnDoe@email.com', '9870654321', '', 1, 3.5, '2017-01-01'),
(4, 'firsttest lasttest', 'password', 'email@email.com', '01234567989', NULL, 1, 4.1, '2017-05-01');

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
  ADD PRIMARY KEY (`oid`),
  ADD KEY `uid` (`uid`);

--
-- Indexes for table `picturesoffer`
--
ALTER TABLE `picturesoffer`
  ADD PRIMARY KEY (`poid`),
  ADD KEY `oid` (`oid`);

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
  MODIFY `oid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
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
  MODIFY `rid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
