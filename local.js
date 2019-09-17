var mysql = require('mysql');
var config = require('./config.json');
var pool  = mysql.createPool({
    connectionLimit : config.connectionLimit,
    host            : config.host,
    user            : config.user,
    password        : config.password,
    database        : config.database 

  });
  
  

pool.getConnection(function(err, connection) {
  if (err) throw err; // not connected!

  // Use the connection
  //let getParam = 'empAll';
  let empSproc = '';
  let empID = null;
  
  if (empID == null)
  {
    empSproc = "readEmployeesAll";
    empID = null;
  }
  else
  {
    empSproc = readEmployeeMonthByID;
    empID = '101';
  }
  //switch(getParam)
  //{
  //  case 'empID':
  //    empSproc = "readEmployeeMonthByID";
  //    empID = '101';  
  //    break;
//
//    case 'empAll':
//      empSproc = "readEmployeesAll";
//      empID = null;
//      break;
//  }

  connection.query('CALL ' + empSproc + '(?)', [empID], function (error, results, fields) {
  //connection.query('SELECT month FROM employee where employeeid = 102', function (error, results, fields) {
    // When done with the connection, release it.
    connection.release();

    // Handle error after the release.
    if (error) throw error;
    //else console.log(results[0][0]);
    else console.log(JSON.stringify(results));

    process.exit();

    // Don't use the connection here, it has been returned to the pool.
  });
});