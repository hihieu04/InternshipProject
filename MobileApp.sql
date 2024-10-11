create database MobileApp;
use MobileApp;

CREATE TABLE Department (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
	department_name NVARCHAR(255) NOT NULL
);

CREATE TABLE roles_auth (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(255) UNIQUE
);

CREATE TABLE account (
    account_id BIGINT PRIMARY KEY IDENTITY(1,1),  
    role_id BIGINT,
    email VARCHAR(255),
    username VARCHAR(255) UNIQUE, 
    password VARCHAR(255),
    is_activity INT,
    verify_code VARCHAR(255),
    FOREIGN KEY (role_id) REFERENCES roles_auth(id)
);



CREATE TABLE user_information (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    date_created VARCHAR(255),
    account_id BIGINT,
    firstname NVARCHAR(255),
    lastname NVARCHAR(255),
    department_id BIGINT, 
    FOREIGN KEY (account_id) REFERENCES account(account_id),
    FOREIGN KEY (department_id) REFERENCES Department(id)
);

CREATE TABLE auth_token (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    user_id BIGINT,
    token_id VARCHAR(255),
    expired_time BIGINT,
    FOREIGN KEY (user_id) REFERENCES user_information(id)
);


CREATE TABLE DateReport (
    report_id INT IDENTITY(1,1) PRIMARY KEY,
	stt BIGINT,
    user_id BIGINT,
	name_person NVARCHAR(255),
    water_level_area NVARCHAR(255),
    date DATE,
    attendance_point BIT,
    personal_equipment_check NVARCHAR(255),
    confirm_sign NVARCHAR(255),
    image_name VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES user_information(id)
);

CREATE TABLE MainRubber (
    main_rubber_id INT IDENTITY(1,1) PRIMARY KEY,
    report_id INT,
    lo_name NVARCHAR(255),
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
    lo_name NVARCHAR(255),
    frozen_kg FLOAT,
    stew_kg FLOAT,
    wire_kg FLOAT,
    total_harvest_kg FLOAT,
    FOREIGN KEY (report_id) REFERENCES DateReport(report_id)
);

CREATE TABLE ReceptionReport (
    reception_report_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT,
	water_level_area NVARCHAR(255),
	date DATE,
	license_plate VARCHAR(255),
    cream_latex_kg FLOAT,
    block_latex_kg FLOAT,
    sheet_latex_kg FLOAT,
    frozen_latex_kg FLOAT,
    cup_latex_kg FLOAT,
    wire_latex_kg FLOAT,
    total_harvest_latex_kg FLOAT,
	image_name VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES user_information(id)
);


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


INSERT INTO roles_auth (name) VALUES ('ADMIN');
INSERT INTO roles_auth (name) VALUES ('USER');


INSERT INTO account (role_id, email, username, password, is_activity, verify_code) 
VALUES (1, 'admin@example.com', 'admin', '$2a$10$SuHMaDcgYTdfplM/A8Nd9uz/tpg5dcvVYXDluXgsH2kCdij0fYx4C', 1, 'VERIFY123');
INSERT INTO account (role_id, email, username, password, is_activity, verify_code) 
VALUES (2, 'user@example.com', 'user', '$2a$10$SuHMaDcgYTdfplM/A8Nd9uz/tpg5dcvVYXDluXgsH2kCdij0fYx4C', 1, 'VERIFY456');
INSERT INTO account (role_id, email, username, password, is_activity, verify_code) 
VALUES (2, 'user@example.com', 'user1', '$2a$10$SuHMaDcgYTdfplM/A8Nd9uz/tpg5dcvVYXDluXgsH2kCdij0fYx4C', 1, 'VERIFY456');
INSERT INTO account (role_id, email, username, password, is_activity, verify_code) 
VALUES (2, 'user@example.com', 'user2', '$2a$10$SuHMaDcgYTdfplM/A8Nd9uz/tpg5dcvVYXDluXgsH2kCdij0fYx4C', 0, 'VERIFY456');

INSERT INTO user_information (date_created, account_id, firstname, lastname, department_id) 
VALUES ('2024-08-22', 1, N'Hiếu', N'Hoàng Mai', 1);
INSERT INTO user_information (date_created, account_id, firstname, lastname, department_id) 
VALUES ('2024-08-22', 2, 'Phien', 'Nguyen Trung', 2);
INSERT INTO user_information (date_created, account_id, firstname, lastname, department_id) 
VALUES ('2024-08-22', 3, 'Hoang', 'Tran Minh', 2);
INSERT INTO user_information (date_created, account_id, firstname, lastname, department_id) 
VALUES ('2024-08-22', 4, 'Sang', 'Dong Gia', 2);

INSERT INTO auth_token (user_id, token_id, expired_time) 
VALUES (1, 'TOKEN123', 1698067200);
INSERT INTO auth_token (user_id, token_id, expired_time) 
VALUES (2, 'TOKEN456', 1698067200);


INSERT INTO DateReport (user_id, stt, name_person, water_level_area, date, attendance_point, personal_equipment_check, confirm_sign, image_name)
VALUES 
(1, 1, N'Hoàng Mai Hiếu', N'Khu vực 1', '2024-08-01', 1, N'Đã kiểm tra', N'Hoàng Mai Hiếu', 'image1.jpg'),
(1, 2, 'Hoang Mai Hieu 2', 'Khu vuc 2', '2024-08-02', 1, 'Da kiem tra', 'Hoang Mai Hieu', 'image2.jpg'),
(1, 3, 'Hoang Mai Hieu 3','Khu vuc 3', '2024-08-03', 0, 'Da kiem tra', 'Hoang Mai Hieu', 'image3.jpg'),
(1, 4, 'Hoang Mai Hieu 4','Khu vuc 4', '2024-08-04', 1, 'Da kiem tra', 'Hoang Mai Hieu', 'image4.jpg'),
(1, 5, 'Hoang Mai Hieu 5','Khu vuc 5', '2024-08-05', 1, 'Da kiem tra', 'Hoang Mai Hieu', 'image5.jpg'),
(1, 6, 'Hoang Mai Hieu 6','Khu vuc 6', '2023-08-06', 1, 'Da kiem tra', 'Hoang Mai Hieu', 'image6.jpg'),
(1, 7, 'Hoang Mai Hieu 7','Khu vuc 7', '2023-08-07', 0, 'Da kiem tra', 'Hoang Mai Hieu', 'image7.jpg'),
(1, 8, 'Hoang Mai Hieu 8','Khu vuc 8', '2023-08-08', 1, 'Da kiem tra', 'Hoang Mai Hieu', 'image8.jpg'),
(1, 9, 'Hoang Mai Hieu 9', 'Khu vuc 9', '2023-08-09', 1, 'Da kiem tra', 'Hoang Mai Hieu', 'image9.jpg'),
(3, 10, 'Hoang Mai Hieu 10','Khu vuc 10', '2023-08-10', 0, 'Da kiem tra', 'Hoang Mai Hieu', 'image10.jpg');

INSERT INTO MainRubber (report_id, lo_name, nh3_liters, first_batch_cream, first_batch_block, first_batch_stove, second_batch_block, second_batch_stove, coagulated_latex)
VALUES 
(1, N'Lô 1', 10.5, 20.5, 15.3, 8.2, 12.1, 7.4, 6.3),
(2, N'Lô 2', 12.0, 19.8, 14.5, 9.0, 13.0, 8.0, 7.0),
(3, N'Lô 3', 11.2, 18.5, 16.0, 7.5, 11.0, 6.5, 5.5),
(4, N'Lô 4', 13.3, 17.5, 13.5, 8.8, 12.5, 7.2, 6.5),
(5, N'Lô 5', 14.1, 16.8, 15.8, 9.1, 13.2, 8.3, 7.2),
(6, N'Lô 6', 10.7, 20.1, 14.7, 8.6, 12.9, 7.9, 6.9),
(7, N'Lô 7', 12.5, 19.3, 15.1, 9.2, 13.5, 8.5, 7.3),
(8, N'Lô 8', 11.9, 18.7, 16.3, 7.7, 11.7, 6.7, 5.9),
(9, N'Lô 9', 13.7, 17.9, 13.7, 8.5, 12.7, 7.7, 6.7),
(10, N'Lô 10', 14.3, 16.5, 15.3, 9.5, 13.9, 8.9, 7.9);


INSERT INTO SecondaryRubber (report_id, lo_name, frozen_kg, stew_kg, wire_kg, total_harvest_kg)
VALUES 
(1, N'Lô 1', 5.3, 7.2, 2.1, 14.6),
(2, N'Lô 2', 6.1, 8.0, 2.5, 16.6),
(3, N'Lô 3', 5.0, 7.0, 2.0, 14.0),
(4, N'Lô 4', 6.5, 8.5, 2.7, 17.7),
(5, N'Lô 5', 5.7, 7.7, 2.3, 15.7),
(6, N'Lô 6', 6.3, 8.3, 2.6, 17.2),
(7, N'Lô 7', 5.4, 7.3, 2.2, 14.9),
(8, N'Lô 8', 6.0, 8.1, 2.4, 16.5),
(9, N'Lô 9', 5.2, 7.1, 2.0, 14.3),
(10, N'Lô 10', 6.6, 8.7, 2.8, 18.1);

INSERT INTO ReceptionReport (
    user_id, water_level_area, date, license_plate, 
    cream_latex_kg, block_latex_kg, sheet_latex_kg, frozen_latex_kg, 
    cup_latex_kg, wire_latex_kg, total_harvest_latex_kg, image_name
)
VALUES 
(1,  'Khu vuc 1', '2024-09-10', 'ABC-123', 
 120.5, 90.3, 85.6, 65.4, 40.2, 30.1, 431.1, 'image1.jpg'),
(3,  'Khu vuc 2', '2024-09-11', 'XYZ-456', 
 110.0, 95.0, 70.0, 60.0, 35.0, 25.0, 395.0, 'image2.jpg'),
(1, 'Khu vuc 3', '2024-09-12', 'DEF-789', 
 130.5, 85.3, 95.6, 75.4, 50.2, 40.1, 476.1, 'image3.jpg'),
(3,  'Khu vuc 4', '2024-09-13', 'GHI-012', 
 140.0, 100.0, 80.0, 70.0, 45.0, 35.0, 470.0, 'image4.jpg'),
(3,  'Khu vuc 5', '2024-09-14', 'JKL-345', 
 115.0, 90.0, 85.0, 65.0, 42.0, 28.0, 425.0, 'image5.jpg'),
(3,  'Khu vuc 6', '2024-09-15', 'MNO-678', 
 125.0, 87.0, 82.0, 60.0, 43.0, 33.0, 430.0, 'image6.jpg'),
(3,  'Khu vuc 7', '2024-09-16', 'PQR-901', 
 135.5, 92.3, 88.6, 68.4, 48.2, 36.1, 468.1, 'image7.jpg'),
(3,  'Khu vuc 8', '2024-09-17', 'STU-234', 
 145.0, 98.0, 75.0, 72.0, 47.0, 37.0, 474.0, 'image8.jpg'),
(1,  'Khu vuc 9', '2024-09-18', 'VWX-567', 
 120.0, 85.0, 90.0, 63.0, 44.0, 32.0, 434.0, 'image9.jpg'),
(1, 'Khu vuc 10', '2024-09-19', 'YZA-890', 
 130.0, 89.0, 80.0, 67.0, 46.0, 34.0, 446.0, 'image10.jpg');
