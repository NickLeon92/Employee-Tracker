DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;
USE employees_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
 id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
 title VARCHAR(30) NOT NULL,
 salary DECIMAL NOT NULL,
 department_id INT,
 FOREIGN KEY (department_id)
 REFERENCES department(id)
 ON DELETE SET NULL
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id)
    REFERENCES role(id)
    ON DELETE SET NULL
);

-- DROP DATABASE IF EXISTS courses_db;
-- CREATE DATABASE courses_db;

-- USE courses_db;

-- CREATE TABLE department (
--   id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
--   name VARCHAR(30) NOT NULL
-- );

-- CREATE TABLE course_names (
--   id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
--   name VARCHAR(30) NOT NULL,
--   department INT,
--   FOREIGN KEY (department)
--   REFERENCES department(id)
--   ON DELETE SET NULL
-- );
