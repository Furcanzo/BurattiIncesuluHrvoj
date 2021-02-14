
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
DROP DATABASE IF EXISTS CLUP_E2E;
CREATE DATABASE IF NOT EXISTS CLUP_E2E;
USE CLUP_E2E;
SET time_zone = "+00:00";

CREATE TABLE `store` (
  `vat` varchar(15) NOT NULL,
  `name` varchar(45) NOT NULL,
  `lat` double NOT NULL,
  `lng` double NOT NULL,
  `capacity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `ticket` (
  `id` varchar(64) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `inside` tinyint(1) NOT NULL DEFAULT 0,
  `user` varchar(45) NOT NULL,
  `store` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `user` (
  `email` varchar(45) NOT NULL,
  `name` varchar(45) NOT NULL,
  `surname` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `store` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `store`
  ADD PRIMARY KEY (`vat`);

ALTER TABLE `ticket`
  ADD PRIMARY KEY (`id`),
  ADD KEY `issuedTo` (`user`),
  ADD KEY `relatedTo` (`store`);

ALTER TABLE `user`
  ADD PRIMARY KEY (`email`),
  ADD KEY `manages` (`store`);

ALTER TABLE `ticket`
  ADD CONSTRAINT `issuedTo` FOREIGN KEY (`user`) REFERENCES `user` (`email`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `relatedTo` FOREIGN KEY (`store`) REFERENCES `store` (`vat`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `user`
  ADD CONSTRAINT `manages` FOREIGN KEY (`store`) REFERENCES `store` (`vat`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

