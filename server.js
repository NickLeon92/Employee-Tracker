const express = require('express');
const inquirer = require('inquirer');
const table = require('console.table')
// Import and require mysql2
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: '',
    database: 'employees_db'
  },
  console.log(`Connected to the employees_db database.`)
);

// Query database
db.query('SELECT * FROM xxxxx', function (err, results) {
  console.log(results);
});

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const Menu = () => {
    return inquirer.prompt(
      {
        type: 'list',
        message: 'Add more employees or finish?',
        name: 'menuChoice',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee Role'],
    }
  
    ).then((answers) => {
        if (answers.menuChoice === 'View All Departments') {
            deptViewer();
            Menu();
        }
        if (answers.menuChoice === 'View All Roles') {
            roleViewer();
            Menu();
        }
        if (answers.menuChoice === 'View All Employees') {
            emplViewer();
            Menu();
        }
        if (answers.menuChoice === 'Add A Departments') {
            deptAdd()
            
        }
        if (answers.menuChoice === 'Add A Roles') {
            roleAdd()
                
        }
        if (answers.menuChoice === 'Add An Employee') {
            emplAdd()
                
        }
    })
  }

  const deptViewer = () => {
    db.query('SELECT * FROM department', function (err, results) {
        console.table(results);
      });
  }

  const roleViewer = () => {
    db.query('SELECT * FROM role', function (err, results) {
        console.table(results);
      });
  }
  
  const emplViewer = () => {
    db.query('SELECT * FROM employee', function (err, results) {
        console.table(results);
      });
  }

  const deptAdd = () => {
    return inquirer.prompt(
        [
            {
              type: 'input',
              name: 'name',
              message: 'Please Enter Department Name:',
            },
          ]).then((answers) => {
            db.query(`INSERT INTO department(name) VALUES(?)`, answers.name, (err, results) => {
                console.table(results);
              });
          })
  }
  const roleAdd = () => {
    return inquirer.prompt(
        [
            {
              type: 'input',
              name: 'title',
              message: 'Please Enter Role Title:',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Please Enter Role Salary:',
              },
              {
                type: 'list',
                message: 'Please Select Department:',
                name: 'deptChoice',
                choices: [deptArray()],
              },
          ]).then((answers) => {
            db.query(`INSERT INTO role(name) VALUES(?)`, answers.title, answers.salary , answers.deptChoice , (err, results) => {
                console.table(results);
              });
          })
  }

  const deptArray = () => {
    const currentDept = [];
    db.query('SELECT DISTINCT first_name FROM students', function (err, results, field) {
        results.forEach(element => {
            currentDept.push(element.first_name)
        });
        return deptReturn;
    });
};
  
  const emplAdd = () => {
    return inquirer.prompt(
        [
            {
              type: 'input',
              name: 'name',
              message: 'Please Enter Employee Name:',
            },
          ]).then((answers) => {
            db.query(`INSERT INTO employee(name) VALUES(?)`, answers.name, (err, results) => {
                console.table(results);
              });
          })
  }

  Menu();