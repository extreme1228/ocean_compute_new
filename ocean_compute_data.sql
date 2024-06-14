-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: ocean_compute
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `data`
--

DROP TABLE IF EXISTS `data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `data` (
  `Data_ID` int NOT NULL AUTO_INCREMENT,
  `Station_ID` int DEFAULT NULL,
  `Timestamp` datetime NOT NULL,
  `Temperature` float NOT NULL,
  `Salinity` float NOT NULL,
  `pH` float NOT NULL,
  `notes` text,
  PRIMARY KEY (`Data_ID`),
  KEY `Station_ID` (`Station_ID`),
  CONSTRAINT `data_ibfk_1` FOREIGN KEY (`Station_ID`) REFERENCES `stations` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data`
--

/*!40000 ALTER TABLE `data` DISABLE KEYS */;
INSERT INTO `data` VALUES (1,5,'2024-06-13 19:47:00',29,65,5.9,'无'),(2,5,'2024-06-07 19:48:00',35,40,6.2,'1'),(3,6,'2024-06-01 21:00:00',25,35,7.8,''),(4,6,'2024-06-10 21:01:00',30,34,8.1,''),(5,17,'2024-06-01 12:00:00',22.5,18.3,7.8,'Sample note 1'),(6,17,'2024-06-02 12:00:00',23.1,19.5,8,'Sample note 2'),(7,17,'2024-06-03 12:00:00',24,17.2,7.9,'Sample note 3'),(8,17,'2024-06-04 12:00:00',22.8,20.1,8.1,'Sample note 4'),(9,17,'2024-06-05 12:00:00',23.7,18.9,7.7,'Sample note 5'),(10,17,'2024-06-06 12:00:00',22.9,21.5,8.2,'Sample note 6'),(11,17,'2024-06-07 12:00:00',24.2,19.3,7.6,'Sample note 7'),(12,17,'2024-06-08 12:00:00',23.4,18.7,7.8,'Sample note 8'),(13,17,'2024-06-09 12:00:00',22.6,20.4,8,'Sample note 9'),(14,17,'2024-06-10 12:00:00',23.8,17.9,8.1,'Sample note 10'),(15,17,'2024-06-11 12:00:00',24.1,21.2,7.9,'Sample note 11'),(16,17,'2024-06-12 12:00:00',22.7,18.8,8.3,'Sample note 12'),(17,17,'2024-06-13 12:00:00',23.9,19.1,7.5,'Sample note 13'),(18,17,'2024-06-14 12:00:00',24.3,21.6,8.2,'Sample note 14'),(19,17,'2024-06-15 12:00:00',22.4,20,8.4,'Sample note 15'),(20,17,'2024-06-14 20:55:00',23,17,8,'无');
/*!40000 ALTER TABLE `data` ENABLE KEYS */;

--
-- Table structure for table `pollutant_data`
--

DROP TABLE IF EXISTS `pollutant_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pollutant_data` (
  `Pollutant_Data_ID` int NOT NULL AUTO_INCREMENT,
  `Station_ID` int DEFAULT NULL,
  `Timestamp` datetime DEFAULT NULL,
  `Pollutant_Type` varchar(50) DEFAULT NULL,
  `Concentration` float DEFAULT NULL,
  `Safety_Threshold` float DEFAULT NULL,
  PRIMARY KEY (`Pollutant_Data_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pollutant_data`
--

/*!40000 ALTER TABLE `pollutant_data` DISABLE KEYS */;
INSERT INTO `pollutant_data` VALUES (2,6,'2024-06-08 20:11:00','abc',99,100),(3,6,'2024-06-13 21:02:00','PM2.5',153,200),(4,17,'2024-06-01 12:00:00','PM2.5',25.3,35),(5,17,'2024-06-02 12:00:00','NO2',45.2,50),(6,17,'2024-06-03 12:00:00','SO2',30.4,40),(7,17,'2024-06-04 12:00:00','O3',50.1,70),(8,17,'2024-06-05 12:00:00','CO',1.2,4),(9,17,'2024-06-06 12:00:00','PM10',55.3,50),(10,17,'2024-06-07 12:00:00','PM2.5',20.5,35),(11,17,'2024-06-08 12:00:00','NO2',38,50),(12,17,'2024-06-09 12:00:00','SO2',22.6,40),(13,17,'2024-06-10 12:00:00','O3',45.9,70),(14,17,'2024-06-11 12:00:00','CO',0.9,4),(15,17,'2024-06-12 12:00:00','PM10',60.2,50),(16,17,'2024-06-13 12:00:00','PM2.5',24.1,35),(17,17,'2024-06-14 12:00:00','NO2',40.7,50),(18,17,'2024-06-15 12:00:00','SO2',25.3,40);
/*!40000 ALTER TABLE `pollutant_data` ENABLE KEYS */;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reports` (
  `Report_ID` int NOT NULL AUTO_INCREMENT,
  `Station_ID` int DEFAULT NULL,
  `Template_Name` varchar(100) DEFAULT NULL,
  `Report_Content` text,
  `Start_Date` datetime DEFAULT NULL,
  `End_Date` datetime DEFAULT NULL,
  PRIMARY KEY (`Report_ID`),
  KEY `Station_ID` (`Station_ID`),
  CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`Station_ID`) REFERENCES `stations` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;

--
-- Table structure for table `stations`
--

DROP TABLE IF EXISTS `stations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `lat` float NOT NULL,
  `lon` float NOT NULL,
  `info` text,
  `data` text,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `stations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`User_ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stations`
--

/*!40000 ALTER TABLE `stations` DISABLE KEYS */;
INSERT INTO `stations` VALUES (1,NULL,'station JP',33.8438,141.041,'ab','cd'),(2,NULL,'1',30.2718,123.959,'2','3'),(5,1,'test',10.6525,52.3512,'test1','test2'),(6,1,'ShangHai',30.5757,123.6,'上海测试点','pH、温度'),(7,1,'Station GuangZhou',21.1889,114.368,'广州测试点','pH、温度、污染物'),(8,1,'Station Japan',33.8475,139.074,'Station Japan','pH、温度、盐度、污染物浓度'),(9,1,'Station London',53.2556,1.75902,'Station London','pH、温度、盐度、污染物浓度'),(10,1,'Station New York',39.6967,-72.7586,'Station New York','pH、温度、盐度、污染物浓度'),(11,1,'Station Los Angeles',33.3507,-118.517,'Station Los Angeles','pH、温度、盐度、污染物浓度'),(12,1,'Station Honolulu',21.5143,-157.174,'Station Honolulu','pH、温度、盐度、污染物浓度'),(13,1,'Station Sydney',-34.2246,-207.958,'Station Sydney','pH、温度'),(14,1,'Station Toamasina',-17.731,-309.567,'Station Toamasina','pH、温度、污染物浓度'),(15,1,'Station North',69.9108,167.323,'Station North','pH、温度、污染物浓度'),(16,1,'Station South',-64.5636,295.917,'Station South','pH、温度、污染物浓度、盐度'),(17,1,'ShangHai',30.5757,123.6,'上海测试点','pH、温度');
/*!40000 ALTER TABLE `stations` ENABLE KEYS */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `User_ID` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(50) DEFAULT NULL,
  `Password` varchar(50) DEFAULT NULL,
  `User_Type` varchar(20) DEFAULT 'General',
  `Contact_Info` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`User_ID`),
  UNIQUE KEY `Username` (`Username`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'root','123','Admin',NULL),(3,'a','a','General',NULL),(4,'abc','abc','General',NULL),(5,'extreme1228','lbw5731606','Admin','2151769@tongji.edu.cn');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

--
-- Dumping routines for database 'ocean_compute'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-14 22:01:42
