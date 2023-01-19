-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 19, 2023 at 06:52 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tbltn_2022_miss_aclc_iriga`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `ID` int(11) NOT NULL,
  `FullName` varchar(64) NOT NULL,
  `PicFilename` varchar(64) NOT NULL,
  `Username` varchar(64) NOT NULL,
  `Password` varchar(64) NOT NULL,
  `DateAdded` timestamp NOT NULL DEFAULT current_timestamp(),
  `DateUpdated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`ID`, `FullName`, `PicFilename`, `Username`, `Password`, `DateAdded`, `DateUpdated`) VALUES
(1, 'Super User', '_default.png', 'admin', '123456', '2019-02-06 02:01:50', '2023-01-19 05:51:04');

-- --------------------------------------------------------

--
-- Table structure for table `candidates`
--

CREATE TABLE `candidates` (
  `ID` int(11) NOT NULL,
  `FullName` varchar(64) NOT NULL,
  `City` varchar(32) NOT NULL,
  `PicFilename` varchar(64) NOT NULL,
  `DateAdded` timestamp NOT NULL DEFAULT current_timestamp(),
  `DateUpdated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `candidates`
--

INSERT INTO `candidates` (`ID`, `FullName`, `City`, `PicFilename`, `DateAdded`, `DateUpdated`) VALUES
(1, 'ALLIYAH DIMPLE B. ROMBANO', 'STEM', '01.jpg', '2022-04-05 07:39:46', '2022-04-05 07:43:21'),
(2, 'JAN KARYLLE D. IBARBIA', 'HUMSS', '02.jpg', '2022-04-05 07:40:42', '2022-04-05 07:43:24'),
(3, 'NICOLE D. PLOTADO', 'STEM', '03.jpg', '2022-04-05 07:41:01', '2022-04-05 07:43:26'),
(4, 'SHIELA C. TAGALOG', 'GAS', '04.jpg', '2022-04-05 07:48:57', '2022-04-05 07:48:57'),
(5, 'FERSILA LEA A. QUIRANTE', 'HUMSS', '05.jpg', '2022-04-05 07:51:47', '2022-04-05 07:51:47'),
(6, 'KIMBERLY J. OCCIANO', 'STEM', '06.jpg', '2022-04-05 07:53:12', '2022-04-05 07:53:12'),
(7, 'ERIKA JADE B. IBO', 'ABM', '07.jpg', '2022-04-05 07:53:31', '2022-04-05 07:53:31'),
(8, 'EUNICE V. NAVARRO', 'GAS', '08.jpg', '2022-04-05 07:53:55', '2022-04-05 07:53:55'),
(9, 'MARIA JESIA R. CAMILA', 'GAS', '09.jpg', '2022-04-05 07:54:16', '2022-04-05 07:54:16'),
(10, 'DESIREE L. AZURES', 'ABM', '10.jpg', '2022-04-05 07:54:37', '2022-04-05 07:54:37'),
(11, 'GWYNETH A. LAGYAP', 'COLLEGE', '11.jpg', '2022-04-05 07:55:22', '2022-04-05 07:55:22'),
(12, 'HANNAH MARIE VALENCIANO', 'HUMSS', '12.jpg', '2022-04-05 07:55:45', '2022-04-05 07:55:45'),
(13, 'JONNA N. RABACAL', 'GAS', '13.jpg', '2022-04-05 07:58:08', '2022-04-05 07:58:08'),
(14, 'HONEY GIRL G. SANIEL', 'ABM', '14.jpg', '2022-04-05 07:58:30', '2022-04-05 07:58:30'),
(15, 'HANNAH GAYLE E. YAPAN', 'STEM', '15.jpg', '2022-04-05 07:58:45', '2022-04-05 07:58:45');

-- --------------------------------------------------------

--
-- Table structure for table `criteria`
--

CREATE TABLE `criteria` (
  `ID` int(11) NOT NULL,
  `Title` varchar(64) NOT NULL,
  `Percentage` double NOT NULL COMMENT 'The percentage of this criteria to make up for the total rating. When this is 0%, it means the total rating will be an average.',
  `PortionID` int(11) NOT NULL,
  `IsLinkedToPortion` tinyint(1) NOT NULL DEFAULT 0 COMMENT '1 if the rating for this criteria is the final rating of a certain portion.',
  `PortionLink` int(11) NOT NULL DEFAULT 1 COMMENT 'The PortionID where to get the rating for this criteria',
  `DateAdded` timestamp NOT NULL DEFAULT current_timestamp(),
  `DateUpdated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `criteria`
--

INSERT INTO `criteria` (`ID`, `Title`, `Percentage`, `PortionID`, `IsLinkedToPortion`, `PortionLink`, `DateAdded`, `DateUpdated`) VALUES
(1, 'Content of the Answer', 20, 1, 0, 1, '2022-04-05 01:41:49', '2022-04-05 01:41:49'),
(2, 'Delivery', 20, 1, 0, 1, '2022-04-05 01:42:23', '2022-04-05 01:42:23'),
(3, 'Beauty and Poise', 60, 1, 0, 1, '2022-04-05 01:42:38', '2022-04-05 01:42:38'),
(4, 'Production Performance', 40, 2, 0, 1, '2022-04-05 01:44:15', '2022-04-05 01:44:15'),
(5, 'Poise and Bearing', 40, 2, 0, 1, '2022-04-05 01:44:26', '2022-04-05 01:44:26'),
(6, 'Over-all Impact', 20, 2, 0, 1, '2022-04-05 01:44:35', '2022-04-05 01:44:35'),
(7, 'Body and Poise', 80, 3, 0, 1, '2022-04-05 01:44:51', '2022-04-05 06:32:25'),
(9, 'Over-all Impact', 20, 3, 0, 1, '2022-04-05 01:45:11', '2022-04-05 01:45:11'),
(10, 'Advocacy and Delivery', 40, 4, 0, 1, '2022-04-05 01:45:41', '2022-04-05 06:32:41'),
(12, 'Beauty and Poise', 60, 4, 0, 1, '2022-04-05 01:46:20', '2022-04-05 01:46:20'),
(13, 'Beauty of the Face', 40, 5, 0, 1, '2022-04-05 01:46:49', '2022-04-05 01:46:49'),
(14, 'Stage Precense', 40, 5, 0, 1, '2022-04-05 01:47:00', '2022-04-05 01:47:00'),
(15, 'Over-all Impact', 20, 5, 0, 1, '2022-04-05 01:47:07', '2022-04-05 01:47:07'),
(16, 'Content of the Answer', 20, 7, 0, 1, '2022-04-05 01:47:53', '2022-04-05 01:47:53'),
(17, 'Delivery', 20, 7, 0, 1, '2022-04-05 01:48:02', '2022-04-05 01:48:02'),
(18, 'Beauty and Poise', 60, 7, 0, 1, '2022-04-05 01:48:09', '2022-04-05 01:48:09'),
(19, 'Closed Door Interview', 60, 6, 1, 1, '2022-04-05 02:18:36', '2022-04-05 02:18:36'),
(20, 'Opening Statement', 40, 6, 1, 4, '2022-04-05 02:18:50', '2022-04-05 02:18:50');

-- --------------------------------------------------------

--
-- Table structure for table `extra_criteria`
--

CREATE TABLE `extra_criteria` (
  `ID` int(11) NOT NULL,
  `Title` varchar(64) NOT NULL,
  `Percentage` double NOT NULL,
  `IsHidden` tinyint(1) NOT NULL DEFAULT 0,
  `PortionID` int(11) NOT NULL,
  `DateAdded` timestamp NOT NULL DEFAULT current_timestamp(),
  `DateUpdated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `extra_ratings`
--

CREATE TABLE `extra_ratings` (
  `CandidateID` int(11) NOT NULL,
  `Rating` double NOT NULL,
  `ID` int(11) NOT NULL,
  `ExtraCriteriaID` int(11) NOT NULL,
  `DateAdded` timestamp NOT NULL DEFAULT current_timestamp(),
  `DateUpdated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `judges`
--

CREATE TABLE `judges` (
  `ID` int(11) NOT NULL,
  `FullName` varchar(64) NOT NULL,
  `IsChairman` tinyint(1) NOT NULL DEFAULT 0,
  `PicFilename` varchar(64) NOT NULL,
  `Username` varchar(64) NOT NULL,
  `Password` varchar(64) NOT NULL,
  `DateAdded` timestamp NOT NULL DEFAULT current_timestamp(),
  `DateUpdated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `judges`
--

INSERT INTO `judges` (`ID`, `FullName`, `IsChairman`, `PicFilename`, `Username`, `Password`, `DateAdded`, `DateUpdated`) VALUES
(1, 'Rudyard C. Pesimo', 1, 'profile.gif', 'judge01', 'judge01', '2022-04-06 00:53:43', '2023-01-19 05:36:24'),
(2, 'Aggie Zephaniah G. Lozada', 0, 'profile.gif', 'judge02', 'judge02', '2022-04-06 00:54:18', '2023-01-19 05:36:27'),
(3, 'Xander Mare S. Barra', 0, 'profile.gif', 'judge03', 'judge03', '2022-04-06 00:54:53', '2023-01-19 05:36:30'),
(4, 'Zairah Shane J. Barcela', 0, 'profile.gif', 'judge04', 'judge04', '2022-04-06 06:18:44', '2023-01-19 05:36:34'),
(5, 'Adrian Co Say Litam', 0, 'profile.gif', 'judge05', 'judge05', '2022-04-06 06:19:25', '2023-01-19 05:36:37');

-- --------------------------------------------------------

--
-- Table structure for table `portions`
--

CREATE TABLE `portions` (
  `ID` int(11) NOT NULL,
  `Title` varchar(128) NOT NULL,
  `DateAdded` timestamp NOT NULL DEFAULT current_timestamp(),
  `DateUpdated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `portions`
--

INSERT INTO `portions` (`ID`, `Title`, `DateAdded`, `DateUpdated`) VALUES
(1, 'Closed Door Interview', '2022-04-05 01:32:10', '2022-04-05 01:32:10'),
(2, 'Production Number', '2022-04-05 01:32:31', '2022-04-05 01:32:31'),
(3, 'Playsuit Competition', '2022-04-05 01:32:57', '2022-04-05 01:32:57'),
(4, 'Opening Statement', '2022-04-05 01:35:07', '2022-04-05 01:35:07'),
(5, 'Long Gown Competition', '2022-04-05 01:35:38', '2022-04-05 01:35:38'),
(6, 'TOP 10', '2022-04-05 01:35:52', '2022-04-05 01:35:52'),
(7, 'Final Q & A', '2022-04-05 01:36:08', '2022-04-05 01:36:08');

-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--

CREATE TABLE `ratings` (
  `ID` int(11) NOT NULL,
  `JudgeID` int(11) NOT NULL,
  `CandidateID` int(11) NOT NULL,
  `CriteriaID` int(11) NOT NULL,
  `Rating` double NOT NULL DEFAULT 0,
  `IsLocked` tinyint(1) NOT NULL DEFAULT 0,
  `DateAdded` timestamp NOT NULL DEFAULT current_timestamp(),
  `DateUpdated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `candidates`
--
ALTER TABLE `candidates`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `criteria`
--
ALTER TABLE `criteria`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `PortionID` (`PortionID`),
  ADD KEY `PortionLink` (`PortionLink`);

--
-- Indexes for table `extra_criteria`
--
ALTER TABLE `extra_criteria`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `PortionID` (`PortionID`);

--
-- Indexes for table `extra_ratings`
--
ALTER TABLE `extra_ratings`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ExtraCriteriaID` (`ExtraCriteriaID`),
  ADD KEY `CandidateID` (`CandidateID`);

--
-- Indexes for table `judges`
--
ALTER TABLE `judges`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `portions`
--
ALTER TABLE `portions`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `JudgeID` (`JudgeID`),
  ADD KEY `CandidateID` (`CandidateID`),
  ADD KEY `CriteriaID` (`CriteriaID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `candidates`
--
ALTER TABLE `candidates`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `criteria`
--
ALTER TABLE `criteria`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `extra_criteria`
--
ALTER TABLE `extra_criteria`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `extra_ratings`
--
ALTER TABLE `extra_ratings`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `judges`
--
ALTER TABLE `judges`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `portions`
--
ALTER TABLE `portions`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `ratings`
--
ALTER TABLE `ratings`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `criteria`
--
ALTER TABLE `criteria`
  ADD CONSTRAINT `criteria_ibfk_1` FOREIGN KEY (`PortionID`) REFERENCES `portions` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `criteria_ibfk_2` FOREIGN KEY (`PortionLink`) REFERENCES `portions` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `extra_criteria`
--
ALTER TABLE `extra_criteria`
  ADD CONSTRAINT `extra_criteria_ibfk_1` FOREIGN KEY (`PortionID`) REFERENCES `portions` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `extra_ratings`
--
ALTER TABLE `extra_ratings`
  ADD CONSTRAINT `extra_ratings_ibfk_1` FOREIGN KEY (`ExtraCriteriaID`) REFERENCES `extra_criteria` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `extra_ratings_ibfk_2` FOREIGN KEY (`CandidateID`) REFERENCES `candidates` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ratings`
--
ALTER TABLE `ratings`
  ADD CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`CandidateID`) REFERENCES `candidates` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`JudgeID`) REFERENCES `judges` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ratings_ibfk_3` FOREIGN KEY (`CriteriaID`) REFERENCES `criteria` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
