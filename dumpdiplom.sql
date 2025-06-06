-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: diplom
-- ------------------------------------------------------
-- Server version	8.0.35

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
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date_created` datetime NOT NULL,
  `check_in_date` datetime NOT NULL,
  `check_out_date` datetime NOT NULL,
  `client` bigint NOT NULL,
  `tour` bigint DEFAULT NULL,
  `room` bigint DEFAULT NULL,
  `total_price` decimal(12,2) NOT NULL,
  `status` varchar(20) NOT NULL,
  `destination` bigint DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `fk_bookings_users_id_client` (`client`),
  KEY `fk_bookings_tours_id_tour` (`tour`),
  KEY `fk_bookings_hotel_rooms_id_room` (`room`),
  CONSTRAINT `fk_bookings_hotel_rooms_id_room` FOREIGN KEY (`room`) REFERENCES `hotel_rooms` (`id`),
  CONSTRAINT `fk_bookings_tours_id_tour` FOREIGN KEY (`tour`) REFERENCES `tours` (`id`),
  CONSTRAINT `fk_bookings_users_id_client` FOREIGN KEY (`client`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,'2025-05-21 01:16:37','2025-05-21 22:03:21','2025-06-20 22:03:21',1,1,NULL,250000.00,'pending',1),(2,'2025-06-06 03:57:14','2025-06-28 03:56:00','2025-06-29 03:56:00',1,1,1,250000.00,'pending',1);
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `destinations`
--

DROP TABLE IF EXISTS `destinations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `destinations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `description` text,
  `climate` varchar(100) DEFAULT NULL,
  `visa_requirements` tinyint(1) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `destinations`
--

LOCK TABLES `destinations` WRITE;
/*!40000 ALTER TABLE `destinations` DISABLE KEYS */;
INSERT INTO `destinations` VALUES (1,'Молдова','описание тура','умереный',0,1);
/*!40000 ALTER TABLE `destinations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hotel_rooms`
--

DROP TABLE IF EXISTS `hotel_rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hotel_rooms` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `hotel` bigint NOT NULL,
  `room_type` bigint NOT NULL,
  `room_number` varchar(20) NOT NULL,
  `price_per_night` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_hotel_rooms_hotels_id_hotel` (`hotel`),
  KEY `fk_hotel_rooms_room_types_id_room_type` (`room_type`),
  CONSTRAINT `fk_hotel_rooms_hotels_id_hotel` FOREIGN KEY (`hotel`) REFERENCES `hotels` (`id`),
  CONSTRAINT `fk_hotel_rooms_room_types_id_room_type` FOREIGN KEY (`room_type`) REFERENCES `room_types` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotel_rooms`
--

LOCK TABLES `hotel_rooms` WRITE;
/*!40000 ALTER TABLE `hotel_rooms` DISABLE KEYS */;
INSERT INTO `hotel_rooms` VALUES (1,1,1,'228',1488.00);
/*!40000 ALTER TABLE `hotel_rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hotels`
--

DROP TABLE IF EXISTS `hotels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hotels` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `stars` int DEFAULT NULL,
  `address` text NOT NULL,
  `destination` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_hotels_destinations_id_destination` (`destination`),
  CONSTRAINT `fk_hotels_destinations_id_destination` FOREIGN KEY (`destination`) REFERENCES `destinations` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotels`
--

LOCK TABLES `hotels` WRITE;
/*!40000 ALTER TABLE `hotels` DISABLE KEYS */;
INSERT INTO `hotels` VALUES (1,'Лазурный',5,'Фрунзе',1);
/*!40000 ALTER TABLE `hotels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_types`
--

DROP TABLE IF EXISTS `room_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_types` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `description` text,
  `capacity` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_types`
--

LOCK TABLES `room_types` WRITE;
/*!40000 ALTER TABLE `room_types` DISABLE KEYS */;
INSERT INTO `room_types` VALUES (1,'Стандарт','Обычный номер',1);
/*!40000 ALTER TABLE `room_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tours`
--

DROP TABLE IF EXISTS `tours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tours` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date_created` datetime NOT NULL,
  `date_expires` datetime NOT NULL,
  `name` varchar(200) NOT NULL,
  `base_price` decimal(12,2) NOT NULL,
  `desc` text NOT NULL,
  `featured` tinyint(1) NOT NULL,
  `cover_image` text NOT NULL,
  `city` varchar(100) NOT NULL,
  `avg_rating` decimal(3,2) NOT NULL,
  `destination` bigint DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tours`
--

LOCK TABLES `tours` WRITE;
/*!40000 ALTER TABLE `tours` DISABLE KEYS */;
INSERT INTO `tours` VALUES (1,'2025-05-06 01:04:13','2025-07-05 21:59:54','Альпийское приключение',250000.00,'Незабываемые походы по швейцарским Альпам с ночёвкой в традиционных шале и дегустацией сыров.',1,'https://i.pinimg.com/736x/15/84/7e/15847e5734dc7837a1a19ec0aa91fc2c.jpg','Швейцария',5.00,1),(2,'2025-05-06 01:05:48','2025-07-05 21:59:54','Венецианские каналы',180000.00,'Романтичное путешествие по каналам Венеции на гондолах с посещением стеклодувных мастерских Мурано.',1,'https://i.pinimg.com/736x/ae/09/ec/ae09ec8e9be6feee3ef443190ab68fd8.jpg','Италия',4.00,1),(3,'2025-05-06 01:07:14','2025-07-07 21:59:54','Сафари в Серенгети',350000.00,'Эксклюзивное сафари с возможностью наблюдать Великую Миграцию животных и ночёвкой в лоджах с видом на саванну.',1,'https://i.pinimg.com/736x/10/be/03/10be03367ff8e0e028069f9389a139a7.jpg','Танзания',4.90,1),(4,'2025-05-06 01:08:34','2025-07-08 21:59:54','Японские сады Киото',220000.00,'Медитативное путешествие по древним храмам и садам камней Киото с чайной церемонией и ночёвкой в рёкане.',1,'https://i.pinimg.com/736x/58/cd/49/58cd49d2cc06d64f1d8cc3914e6cd801.jpg','Япония',4.70,1),(5,'2025-05-06 01:09:48','2025-07-05 21:59:54','Норвежские фьорды',280000.00,'Круиз по величественным фьордам с возможностью увидеть северное сияние и посетить рыбные рынки Бергена.',1,'https://i.pinimg.com/736x/aa/af/f5/aaaff5450fa08b78836c8d01a8a4ad21.jpg','Норвегия',4.90,1),(6,'2025-05-06 01:10:56','2025-07-05 21:59:54','Марокканские медины',150000.00,'Погружение в атмосферу восточной сказки с посещением рынков, дворцов и ночёвкой в традиционном риаде.',1,'https://i.pinimg.com/736x/f2/24/5e/f2245e7ba542b88df381fcabf96f071f.jpg','Марокко',4.50,1),(7,'2025-05-06 01:12:06','2025-07-05 21:59:54','Австралийский Барьерный риф',320000.00,'Дайвинг-тур к Большому Барьерному рифу с проживанием на острове Хайман и изучением морской экосистемы.',1,'https://i.pinimg.com/736x/3d/d9/08/3dd9088ea1833df12259d1799b0961c5.jpg','Австралия',4.80,1),(8,'2025-05-06 01:13:08','2025-07-05 21:59:54','Исландские гейзеры',300000.00,'Путешествие по земле льдов и огня с посещением Голубой лагуны, водопадов и вулканических пейзажей.',1,'https://i.pinimg.com/736x/15/a8/dd/15a8dd2f02a64f62f057702d18b740d5.jpg','Исландия',4.90,1);
/*!40000 ALTER TABLE `tours` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `surname` varchar(50) DEFAULT NULL,
  `email` varchar(250) NOT NULL,
  `password` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Матвеев','Кирилл','Дмитриевич','email@email.ru','9d6cabbb84e1e02dfb8074a6bcf6a922af81a546dd7fc80527032b9f451102a6'),(2,'Кирилл','Матвеев','Дмитриевич','email@email.com','9d6cabbb84e1e02dfb8074a6bcf6a922af81a546dd7fc80527032b9f451102a6');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-06  3:59:37
