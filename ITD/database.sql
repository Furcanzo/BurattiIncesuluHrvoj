CREATE TABLE Customer
(
  name VARCHAR NOT NULL,
  surname VARCHAR NOT NULL,
  phoneNumber INT NOT NULL,
  email VARCHAR NOT NULL,
  customerID INT NOT NULL,
  PRIMARY KEY (customerID)
);

CREATE TABLE PartnerStore
(
  partnerID INT NOT NULL,
  storeID INT NOT NULL,
  PRIMARY KEY (partnerID)
);

CREATE TABLE Store
(
  storeID INT NOT NULL,
  name VARCHAR NOT NULL,
  description VARCHAR NOT NULL,
  longitude FLOAT NOT NULL,
  latitude FLOAT NOT NULL,
  maxCustomers INT NOT NULL,
  timeOut INT NOT NULL,
  partnerID INT,
  PRIMARY KEY (storeID),
  FOREIGN KEY (partnerID) REFERENCES PartnerStore(partnerID)
);

CREATE TABLE WorkingHours
(
  from DATE NOT NULL,
  until DATE NOT NULL,
  storeID INT NOT NULL,
  FOREIGN KEY (storeID) REFERENCES Store(storeID)
);

CREATE TABLE Employe
(
  employeID INT NOT NULL,
  email VARCHAR NOT NULL,
  Role VARCHAR NOT NULL,
  storeID INT NOT NULL,
  PRIMARY KEY (employeID),
  FOREIGN KEY (storeID) REFERENCES Store(storeID)
);

CREATE TABLE LineNumber
(
  from DATE NOT NULL,
  until DATE NOT NULL,
  number INT NOT NULL,
  status VARCHAR NOT NULL,
  lineNumberID INT NOT NULL,
  customerID INT NOT NULL,
  storeID INT NOT NULL,
  PRIMARY KEY (lineNumberID),
  FOREIGN KEY (customerID) REFERENCES Customer(customerID),
  FOREIGN KEY (storeID) REFERENCES Store(storeID)
);
