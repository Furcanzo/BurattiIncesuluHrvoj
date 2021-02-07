-- MySQL dump 10.13  Distrib 8.0.21, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: clup
-- ------------------------------------------------------
-- Server version	8.0.21

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `name` varchar(50) NOT NULL,
  `surname` varchar(50) NOT NULL,
  `phoneNumber` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `customerID` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`customerID`),
  UNIQUE KEY `customerID` (`customerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `employeeID` int NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `Role` varchar(50) NOT NULL,
  `storeID` int NOT NULL,
  PRIMARY KEY (`employeeID`),
  UNIQUE KEY `employeeID` (`employeeID`),
  KEY `storeID` (`storeID`),
  CONSTRAINT `employee_ibfk_1` FOREIGN KEY (`storeID`) REFERENCES `store` (`storeID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `linenumber`
--

DROP TABLE IF EXISTS `linenumber`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `linenumber` (
  `startTime` bigint NOT NULL,
  `endTime` bigint NOT NULL,
  `status` varchar(50) NOT NULL,
  `lineNumberID` int NOT NULL AUTO_INCREMENT,
  `number` int NOT NULL,
  `customerID` int DEFAULT NULL,
  `storeID` int NOT NULL,
  `timeSlotID` int NOT NULL,
  PRIMARY KEY (`lineNumberID`),
  UNIQUE KEY `lineNumberID` (`lineNumberID`),
  KEY `storeID` (`storeID`),
  KEY `linenumber_ibfk_3_idx` (`timeSlotID`),
  KEY `linenumber_ibfk_1` (`customerID`),
  CONSTRAINT `linenumber_ibfk_1` FOREIGN KEY (`customerID`) REFERENCES `customer` (`customerID`),
  CONSTRAINT `linenumber_ibfk_2` FOREIGN KEY (`storeID`) REFERENCES `store` (`storeID`),
  CONSTRAINT `linenumber_ibfk_3` FOREIGN KEY (`timeSlotID`) REFERENCES `timeslot` (`timeSlotID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `linenumber`
--

LOCK TABLES `linenumber` WRITE;
/*!40000 ALTER TABLE `linenumber` DISABLE KEYS */;
/*!40000 ALTER TABLE `linenumber` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partnerstore`
--

DROP TABLE IF EXISTS `partnerstore`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partnerstore` (
  `partnerID` int NOT NULL AUTO_INCREMENT,
  `partnerStoreID` int NOT NULL,
  `primaryStoreID` int NOT NULL,
  PRIMARY KEY (`partnerID`),
  UNIQUE KEY `partnerID` (`partnerID`),
  KEY `primaryStoreID` (`primaryStoreID`),
  KEY `partnerStoreID` (`partnerStoreID`),
  CONSTRAINT `partnerstore_ibfk_1` FOREIGN KEY (`primaryStoreID`) REFERENCES `store` (`storeID`),
  CONSTRAINT `partnerstore_ibfk_2` FOREIGN KEY (`partnerStoreID`) REFERENCES `store` (`storeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partnerstore`
--

LOCK TABLES `partnerstore` WRITE;
/*!40000 ALTER TABLE `partnerstore` DISABLE KEYS */;
/*!40000 ALTER TABLE `partnerstore` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store`
--

DROP TABLE IF EXISTS `store`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store` (
  `storeID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(50) NOT NULL,
  `longitude` float NOT NULL,
  `latitude` float NOT NULL,
  `maxCustomers` int NOT NULL,
  `timeOut` int NOT NULL,
  `workingHourID` int NOT NULL,
  PRIMARY KEY (`storeID`),
  UNIQUE KEY `storeID` (`storeID`),
  KEY `workingHourID` (`workingHourID`),
  CONSTRAINT `store_ibfk_1` FOREIGN KEY (`workingHourID`) REFERENCES `workinghours` (`workingHoursID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store`
--

LOCK TABLES `store` WRITE;
/*!40000 ALTER TABLE `store` DISABLE KEYS */;
/*!40000 ALTER TABLE `store` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `timeslot`
--

DROP TABLE IF EXISTS `timeslot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timeslot` (
  `startTime` bigint NOT NULL,
  `endTime` bigint NOT NULL,
  `timeSlotID` int NOT NULL AUTO_INCREMENT,
  `storeID` int NOT NULL,
  PRIMARY KEY (`timeSlotID`),
  KEY `storeID` (`storeID`),
  CONSTRAINT `timeslot_ibfk_1` FOREIGN KEY (`storeID`) REFERENCES `store` (`storeID`)
) ENGINE=InnoDB AUTO_INCREMENT=43441 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timeslot`
--

LOCK TABLES `timeslot` WRITE;
/*!40000 ALTER TABLE `timeslot` DISABLE KEYS */;
/*!40000 ALTER TABLE `timeslot` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workinghours`
--

DROP TABLE IF EXISTS `workinghours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workinghours` (
  `workingHoursID` int NOT NULL AUTO_INCREMENT,
  `openingTime` int NOT NULL,
  `closingTime` int NOT NULL,
  PRIMARY KEY (`workingHoursID`),
  UNIQUE KEY `workingHoursID` (`workingHoursID`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workinghours`
--

LOCK TABLES `workinghours` WRITE;
/*!40000 ALTER TABLE `workinghours` DISABLE KEYS */;
/*!40000 ALTER TABLE `workinghours` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-02-07 18:38:12
