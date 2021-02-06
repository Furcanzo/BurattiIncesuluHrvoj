CREATE DATABASE IF NOT EXISTS clup;
USE clup;
CREATE TABLE Customer
(
  name VARCHAR(50) NOT NULL,
  surname VARCHAR(50) NOT NULL,
  phoneNumber VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  customerID INT NOT NULL UNIQUE AUTO_INCREMENT,
  PRIMARY KEY (customerID)
);

CREATE TABLE WorkingHours
(
  workingHoursID INT NOT NULL UNIQUE AUTO_INCREMENT,
  openingTime INT NOT NULL,
  closingTime INT NOT NULL,
  PRIMARY KEY (workingHoursID)
);

CREATE TABLE Store
(
  storeID INT NOT NULL UNIQUE AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(50) NOT NULL,
  longitude FLOAT NOT NULL,
  latitude FLOAT NOT NULL,
  maxCustomers INT NOT NULL,
  timeOut INT NOT NULL,
  workingHourID INT NOT NULL,
  PRIMARY KEY (storeID),
  FOREIGN KEY (workingHourID) REFERENCES WorkingHours(workingHoursID)
);

CREATE TABLE Employee
(
  employeeID INT NOT NULL UNIQUE AUTO_INCREMENT,
  email VARCHAR(50) NOT NULL,
  Role VARCHAR(50) NOT NULL,
  storeID INT NOT NULL,
  PRIMARY KEY (employeeID),
  FOREIGN KEY (storeID) REFERENCES Store(storeID)
);

CREATE TABLE PartnerStore
(
  partnerID INT NOT NULL UNIQUE AUTO_INCREMENT,
  partnerStoreID INT NOT NULL,
  primaryStoreID INT NOT NULL,
  PRIMARY KEY (partnerID),
  FOREIGN KEY (primaryStoreID) REFERENCES Store(storeID),
  FOREIGN KEY (partnerStoreID) REFERENCES Store(storeID)
   );

CREATE TABLE TimeSlot
(
  startTime INT NOT NULL,
  endTime INT NOT NULL,
  timeSlotID INT NOT NULL,
  storeID INT NOT NULL,
  PRIMARY KEY (timeSlotID),
  FOREIGN KEY (storeID) REFERENCES Store(storeID)
);

CREATE TABLE LineNumber
(
  startTime INT NOT NULL,
  endTime INT NOT NULL,
  status VARCHAR(50) NOT NULL,
  lineNumberID INT NOT NULL UNIQUE AUTO_INCREMENT,
  number INT NOT NULL,
  customerID INT NOT NULL,
  storeID INT NOT NULL,
  timeSlotID INT NOT NULL,
  PRIMARY KEY (lineNumberID),
  FOREIGN KEY (customerID) REFERENCES Customer(customerID),
  FOREIGN KEY (storeID) REFERENCES Store(storeID),
  FOREIGN KEY (timeSlotID) REFERENCES TimeSlot(timeSlotID)
);
