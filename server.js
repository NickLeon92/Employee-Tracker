const express = require('express');
const inquirer = require('inquirer');
const table = require('console.table')
// Import and require mysql2
const mysql = require('mysql2');
const { clearLine } = require('inquirer/lib/utils/readline');
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
      // console.log('testttt')
    
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
        if (answers.menuChoice === 'Update An Employee Role') {
          emplUpdate()
              
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
                // console.log(index)
                // console.log(parseInt(index))
                Menu();
              });}
          }).catch((err) => console.error(err))
              
  }
  const emplAdd = () => {
    
    const arraytest1 =[];
    const arraytest2 =[];
    const managers =[];

    db.query('SELECT title FROM role', function (err, results, field) {
        // console.log(results)
        results.forEach(element => {
          arraytest1.push(element.title)
        });
        console.log(arraytest1)
    })
    db.query(`SELECT id, first_name, last_name FROM employee WHERE manager_id IS NULL`, function (err, results, field) {
      // console.log(results)
      results.forEach(element => {
        arraytest2.push(element.first_name + ' ' + element.last_name)
        managers.push([element.id, element.first_name + ' ' + element.last_name])
      });
      arraytest2.push('None')
      // console.log(arraytest2)
      // console.log(managers)
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
          ]).then((answers) => {

            // console.log('HERE??')
            let index1;
            let index2 = getIndex(managers,answers.manChoice);


            if (answers.manChoice === 'None'){
              index2 = null;
            }

            // else{
            //   index2 = getIndex(managers,answers.manChoice);
            //   console.log('TOAST1: ', index2)
            // }
            
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

  
  const emplUpdate = () => { 
    
    const employees =[];
    const employeesref =[];
    const roles =[];
    const rolesref = [];

  
    
    db.query('SELECT id, first_name, last_name FROM employee', function (err, results, field) {
      // console.log(results)
      results.forEach(element => {
        employees.push(element.first_name + ' ' + element.last_name)
        employeesref.push([element.id, element.first_name + ' ' + element.last_name])
      });
      callnext()
    })

    function callnext() {
    db.query(`SELECT id, title FROM role`, function (err, results, field) {
      // console.log(results)
      results.forEach(element => {
        roles.push(element.title)
        rolesref.push([element.id, element.title])
      });
      callmenu()
    })  
  }

    function callmenu (){
    
    return inquirer.prompt(
      [
        {
          type: 'list',
          message: 'Please Select Employee to Update Role:',
          name: 'emplChoice',
          choices: employees,
        },
        {
          type: 'list',
          message: 'Please Select New Role:',
          name: 'roleChoice',
          choices: roles,
        }
      ]).then((answers) => {
        
        let emplIndex = getIndex(employeesref, answers.emplChoice);
        let roleIndex = getIndex(rolesref, answers.roleChoice);
        // console.log('EMPLOYEE/ROLE ID: ', emplIndex, roleIndex)
        Update()
        
        function Update() {
          
          db.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [roleIndex, emplIndex], (err, results) => {
            
            Menu();
          });}
          
          
        }
        
        ).catch((err) => console.error(err))}
  }
      
      const getIndex = (matrix, arg) => {
        console.log('GET INDEX IS ACTIVATED')
        let thisElement;
        matrix.forEach(element=>
          {
            if(element[1] === arg){
              thisElement =  element[0]
            }
          })
        return thisElement
      }
      Menu();