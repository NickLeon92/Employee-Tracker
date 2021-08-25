const express = require('express');
const inquirer = require('inquirer');
const table = require('console.table')
// Import and require mysql2
const mysql = require('mysql2');
let index;

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
            
            
            db.query(`SELECT id from department where name = '${answers.deptChoice}'`, function (err, results){
               
               index = parseInt(results[0].id);
               pls()
            });
            function pls () {
            db.query(`INSERT INTO role(title, salary, department_id) VALUES(?,?,?)`, [answers.title, parseInt(answers.salary) , index] , (err, results) => {
                console.log(index)
                console.log(parseInt(index))
                Menu();
              });}
          }).catch((err) => console.error(err))
              
  }
  const emplAdd = () => {
    
    const arraytest1 =[];
    const arraytest2 =[];

    db.query('SELECT title FROM role', function (err, results, field) {
        // console.log(results)
        results.forEach(element => {
          arraytest1.push(element.title)
        });
        // console.log(arraytest1)
    })
    db.query(`SELECT id FROM employee WHERE manager_id IS NULL`, function (err, results, field) {
      // console.log(results)
      results.forEach(element => {
        arraytest2.push(element.id)
      });
      arraytest2.push('None')
      // console.log(arraytest2)
    })  
  
      
    return inquirer.prompt(
        [
            {
                type: 'input',
                name: 'first_name',
                message: 'Please Enter First Name:',
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'Please Enter Last Name:',
            },
            {
                type: 'list',
                message: 'Please Select Role:',
                name: 'roleChoice',
                choices: arraytest1,
            },
            {
                type: 'list',
                message: 'Please Select Manager ID:',
                name: 'manChoice',
                choices: arraytest2,
            }
          ]).then(async (answers) => {

            let index1;
            let index2 = answers.manChoice;

            if (answers.manChoice === 'None'){
              index2 = null;
            }
            
            db.query(`SELECT id from role where title = '${answers.roleChoice}'`, function (err, results){
  
              index1 = parseInt(results[0].id);
              pls2()
              
            });

            
              function pls2() {
              
              db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)`, [answers.first_name, answers.last_name, index1, index2], (err, results) => {
   
                   Menu();
                 });}
            
            
            }

          

          
        
            
              
          ).catch((err) => console.error(err))
              
  }
  
  Menu();