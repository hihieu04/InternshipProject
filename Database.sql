Create database InternShip;
Use InternShip;
CREATE TABLE Account (
	account_id INT IDENTITY(1,1) PRIMARY KEY,
	username VARCHAR(255) UNIQUE NOT NULL,
	password VARCHAR(255) NOT NULL,
	role VARCHAR(255) NOT NULL
);

CREATE TABLE Department (
	department_id INT IDENTITY(1,1) PRIMARY KEY,
	department_name VARCHAR(255) NOT NULL
);

CREATE TABLE Users (
	user_id INT IDENTITY(1,1) PRIMARY KEY,
	account_id INT NOT NULL,
	full_name VARCHAR(255) NOT NULL,
	phone_number VARCHAR(255) NOT NULL,
	address VARCHAR(255) NOT NULL,
	department_id INT, 
	FOREIGN KEY (account_id) REFERENCES Account(account_id),
	FOREIGN KEY (department_id) REFERENCES Department(department_id) 
);


CREATE TABLE DateReport(
	report_id INT IDENTITY(1,1) PRIMARY KEY,
	user_id INT,
	water_level_area VARCHAR(255),
	date DATE,
	attendance_point BIT,
	personal_equipment_check VARCHAR(255),
	confirm_sign VARCHAR(255),
	imageName VARCHAR(255),
	FOREIGN KEY (user_id ) REFERENCES Users(user_id )
);

CREATE TABLE MainRubber (
	main_rubber_id INT IDENTITY(1,1) PRIMARY KEY,
	report_id INT,
	lo_name VARCHAR(255),
	nh3_liters FLOAT,
	first_batch_cream FLOAT,
	first_batch_block FLOAT,
	first_batch_stove FLOAT,
	second_batch_block FLOAT,
	second_batch_stove FLOAT,
	coagulated_latex FLOAT,
	FOREIGN KEY (report_id) REFERENCES DateReport(report_id)
);

CREATE TABLE SecondaryRubber (
	secondary_rubber_id INT IDENTITY(1,1) PRIMARY KEY,
	report_id INT,
	lo_name VARCHAR(255),
	frozen_kg FLOAT,
	stew_kg FLOAT,
	wire_kg FLOAT,
	total_harvest_kg FLOAT,
	FOREIGN KEY (report_id) REFERENCES DateReport(report_id)
);

CREATE TABLE ReceptionReport (
	reception_report_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT,
    content VARCHAR(255),
    cream_latex_kg FLOAT,
    block_latex_kg FLOAT,
    stove_latex_kg FLOAT,
    frozen_latex_kg FLOAT,
    cup_latex_kg FLOAT,
    wire_latex_kg FLOAT,
    total_harvest_latex_kg FLOAT,
	confirm_sign VARCHAR(255),
    FOREIGN KEY (user_id ) REFERENCES Users(user_id )
    );

INSERT INTO Account (username, password, role)
VALUES 
('user1', 'password1', 'admin'),
('user2', 'password2', 'user'),
('user3', 'password3', 'user'),
('user4', 'password4', 'user'),
('user5', 'password5', 'user'),
('user6', 'password6', 'user'),
('user7', 'password7', 'user'),
('user8', 'password8', 'user'),
('user9', 'password9', 'user'),
('user10', 'password10', 'admin');


INSERT INTO Department (department_name)
VALUES 
('HR'),
('Finance'),
('IT'),
('Operations'),
('Sales'),
('Marketing'),
('Production'),
('R&D'),
('Logistics'),
('Customer Support');


INSERT INTO Users (account_id, full_name, phone_number, address, department_id)
VALUES 
(1, 'John Doe', '123456789', '123 Main St', 1),
(2, 'Jane Smith', '987654321', '456 Elm St', 2),
(3, 'Alice Johnson', '456789123', '789 Oak St', 3),
(4, 'Bob Brown', '321654987', '321 Pine St', 4),
(5, 'Charlie Davis', '654123987', '654 Maple St', 5),
(6, 'Diana White', '789321654', '987 Cedar St', 6),
(7, 'Evan Green', '123789654', '159 Walnut St', 7),
(8, 'Fiona Black', '456123789', '753 Chestnut St', 8),
(9, 'George King', '789654123', '357 Birch St', 9),
(10, 'Hannah Lee', '987321654', '951 Spruce St', 10);




INSERT INTO DateReport (user_id, water_level_area, date, attendance_point, personal_equipment_check, confirm_sign, imageName)
VALUES 
(1, 'Area 1', '2024-08-01', 1, 'Checked', 'John Doe', 'image1.jpg'),
(2, 'Area 2', '2024-08-02', 1, 'Checked', 'Jane Smith', 'image2.jpg'),
(3, 'Area 3', '2024-08-03', 0, 'Unchecked', 'Alice Johnson', 'image3.jpg'),
(4, 'Area 4', '2024-08-04', 1, 'Checked', 'Bob Brown', 'image4.jpg'),
(5, 'Area 5', '2024-08-05', 1, 'Unchecked', 'Charlie Davis', 'image5.jpg'),
(6, 'Area 6', '2024-08-06', 1, 'Checked', 'Diana White', 'image6.jpg'),
(7, 'Area 7', '2024-08-07', 0, 'Unchecked', 'Evan Green', 'image7.jpg'),
(8, 'Area 8', '2024-08-08', 1, 'Checked', 'Fiona Black', 'image8.jpg'),
(9, 'Area 9', '2024-08-09', 1, 'Checked', 'George King', 'image9.jpg'),
(10, 'Area 10', '2024-08-10', 0, 'Unchecked', 'Hannah Lee', 'image10.jpg');


INSERT INTO MainRubber (report_id, lo_name, nh3_liters, first_batch_cream, first_batch_block, first_batch_stove, second_batch_block, second_batch_stove, coagulated_latex)
VALUES 
(1, 'Lot 1', 10.5, 20.5, 15.3, 8.2, 12.1, 7.4, 6.3),
(2, 'Lot 2', 12.0, 19.8, 14.5, 9.0, 13.0, 8.0, 7.0),
(3, 'Lot 3', 11.2, 18.5, 16.0, 7.5, 11.0, 6.5, 5.5),
(4, 'Lot 4', 13.3, 17.5, 13.5, 8.8, 12.5, 7.2, 6.5),
(5, 'Lot 5', 14.1, 16.8, 15.8, 9.1, 13.2, 8.3, 7.2),
(6, 'Lot 6', 10.7, 20.1, 14.7, 8.6, 12.9, 7.9, 6.9),
(7, 'Lot 7', 12.5, 19.3, 15.1, 9.2, 13.5, 8.5, 7.3),
(8, 'Lot 8', 11.9, 18.7, 16.3, 7.7, 11.7, 6.7, 5.9),
(9, 'Lot 9', 13.7, 17.9, 13.7, 8.5, 12.7, 7.7, 6.7),
(10, 'Lot 10', 14.3, 16.5, 15.3, 9.5, 13.9, 8.9, 7.9);



INSERT INTO SecondaryRubber (report_id, lo_name, frozen_kg, stew_kg, wire_kg, total_harvest_kg)
VALUES 
(1, 'Lot 1', 5.3, 7.2, 2.1, 14.6),
(2, 'Lot 2', 6.1, 8.0, 2.5, 16.6),
(3, 'Lot 3', 5.0, 7.0, 2.0, 14.0),
(4, 'Lot 4', 6.5, 8.5, 2.7, 17.7),
(5, 'Lot 5', 5.7, 7.7, 2.3, 15.7),
(6, 'Lot 6', 6.3, 8.3, 2.6, 17.2),
(7, 'Lot 7', 5.4, 7.3, 2.2, 14.9),
(8, 'Lot 8', 6.0, 8.1, 2.4, 16.5),
(9, 'Lot 9', 5.2, 7.1, 2.0, 14.3),
(10, 'Lot 10', 6.6, 8.7, 2.8, 18.1);


INSERT INTO ReceptionReport (user_id, content, cream_latex_kg, block_latex_kg, stove_latex_kg, frozen_latex_kg, cup_latex_kg, wire_latex_kg, total_harvest_latex_kg, confirm_sign)
VALUES 
(1, 'Report 1', 5.5, 7.5, 3.0, 2.0, 1.0, 0.5, 19.5, 'John Doe'),
(2, 'Report 2', 6.0, 8.0, 3.2, 2.2, 1.1, 0.6, 21.1, 'Jane Smith'),
(3, 'Report 3', 5.3, 7.3, 3.1, 2.1, 1.2, 0.7, 19.7, 'Alice Johnson'),
(4, 'Report 4', 6.1, 8.1, 3.3, 2.3, 1.3, 0.8, 21.9, 'Bob Brown'),
(5, 'Report 5', 5.7, 7.7, 3.4, 2.4, 1.4, 0.9, 21.5, 'Charlie Davis'),
(6, 'Report 6', 6.3, 8.3, 3.5, 2.5, 1.5, 1.0, 22.1, 'Diana White'),
(7, 'Report 7', 5.6, 7.6, 3.0, 2.0, 1.0, 0.5, 19.7, 'Evan Green'),
(8, 'Report 8', 6.2, 8.2, 3.1, 2.1, 1.1, 0.6, 21.3, 'Fiona Black'),
(9, 'Report 9', 5.4, 7.4, 3.2, 2.2, 1.2, 0.7, 19.9, 'George King'),
(10, 'Report 10', 6.4, 8.4, 3.3, 2.3, 1.3, 0.8, 22.5, 'Hannah Lee');



select * from DateReport
select * from MainRubber
select * from SecondaryRubber
select * from ReceptionReport