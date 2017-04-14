-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 13, 2017 at 10:50 AM
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
-- Table structure for table `offer`
--

CREATE TABLE `offer` (
  `oid` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text,
  `location` varchar(100) NOT NULL,
  `availability` varchar(100) NOT NULL,
  `expirydate` date DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

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
  `expirydate` date DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

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
  `stars` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`uid`, `name`, `password`, `email`, `phone`, `picture`, `type`, `stars`) VALUES
(1, 'Washing Inc.', 'password', 'washing@email.com', '0123456789', NULL, 1, 3);

--
-- Indexes for dumped tables
--

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
-- AUTO_INCREMENT for table `offer`
--
ALTER TABLE `offer`
  MODIFY `oid` int(11) NOT NULL AUTO_INCREMENT;
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
  MODIFY `rid` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
