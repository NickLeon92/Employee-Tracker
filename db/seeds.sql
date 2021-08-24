INSERT INTO department (name)
VALUES ("Engineering"),
       ("Sales"),
       ("Production"),
       ("HR");

INSERT INTO role (title, salary, department_id)
VALUES ("Director of Engineering", 100, 1),
       ("Head of Marketing/Sales", 100, 2),
       ("Operations Manger", 100, 3),
       ("HR Director", 100, 4),
       ("Full-Stack Developer", 75, 1);

       

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Nick", "Leon", 1, NULL),
       ("Cosmo", "Kramer", 2, NULL),
       ("Jerry", "Seinfeld", 3, NULL),
       ("Elaine", "Benes", 4, NULL),
       ("Barack", "Obama", 5, 1);
