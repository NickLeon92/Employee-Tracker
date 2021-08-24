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
//   console.log(`Connected to the employees_db database.`)
);

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
});

const Menu = () => {
    return inquirer.prompt(
        [
      {
        type: 'list',
        message: 'Select Action:',
        name: 'menuChoice',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee Role'],
    }]
  
    ).then((answers) => {
    
        if (answers.menuChoice === 'View All Departments') {
            deptViewer();
        }
        if (answers.menuChoice === 'View All Roles') {
            roleViewer();
            
        }
        if (answers.menuChoice === 'View All Employees') {
            emplViewer();
            
        }
        if (answers.menuChoice === 'Add A Department') {
            deptAdd()
                .then((answers) => {
                db.query(`INSERT INTO department(name) VALUES(?)`, answers.name, (err, results) => {
                    Menu();
                  });
              }).catch((err) => console.error(err))
            
        }
        if (answers.menuChoice === 'Add A Role') {
            roleAdd()
                
        }
        if (answers.menuChoice === 'Add An Employee') {
            emplAdd()
                
        }
    }).catch((err) => console.error(err))
  }

  const deptViewer = () => {
    db.query('SELECT * FROM department', function (err, results) {
        console.log('\n')
        console.table(results);
        console.log('---------------------------------------')
        Menu();
      });
  }

  const roleViewer = () => {
    db.query('SELECT * FROM role', function (err, results) {
        console.log('\n')
        console.table(results);
        console.log('---------------------------------------')
        Menu();
      });
  }
  
  const emplViewer = () => {
    db.query('SELECT * FROM employee', function (err, results) {
        console.log('\n')
        console.table(results);
        console.log('---------------------------------------')
        Menu();
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
        ]);
  };
  const roleAdd = () => {
    
    const arraytest =[];

    db.query('SELECT name FROM department', function (err, results, field) {
        results.forEach(element => {
          arraytest.push(element.name)
        });
    })
      
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
                choices: arraytest,
            },
          ]).then((answers) => {
            let index;
            db.query(`SELECT id from department where name = '${answers.deptChoice}'`, function (err, results){
               console.log(results)
               index = results[0].id
               console.log(index)
            })
              
            db.query(`INSERT INTO role(title, salary, department_id) VALUES(?)`, [answers.title, answers.salary , index] , (err, results) => {
                Menu();
              });
          }).catch((err) => console.error(err))
  }
  

  
//   const emplAdd = () => {
//     return inquirer.prompt(
//         [
//             {
//               type: 'input',
//               name: 'name',
//               message: 'Please Enter Employee Name:',
//             },
//           ]).then((answers) => {
//             db.query(`INSERT INTO employee(name) VALUES(?)`, answers.name, (err, results) => {
//                 console.table(results);
//               });
//           })
//   }

  Menu();