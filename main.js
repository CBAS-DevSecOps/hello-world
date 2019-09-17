var mysql = require('mysql');
var config = require('./config.json');
var pool  = mysql.createPool({
    connectionLimit : config.connectionLimit,
    host            : config.host,
    user            : config.user,
    password        : config.password,
    database        : config.database 

  });
  
exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  pool.getConnection(function(err, connection) {
  
  
  // Use the connection
  let empID = event['empID'];
  let empSproc = '';
  
  if (empID == null || empID == '')
  {
    empSproc = "readEmployeesAll";
    empID = null;
  }
  else
  {
    empSproc = "readEmployeeMonthByID";
  }

  connection.query('CALL ' + empSproc + '(?)', [empID], function (error, results, fields) {
  
    //connection.query('CALL readEmployeeMonthByID (?)', [empID], function (error, results, fields) {
    // When done with the connection, release it.
    connection.release();

    // Handle error after the release.
    if (error) callback(error);
    else callback(null,results[0]);
    //else callback(null,results[0][0]);
    //else console.log(JSON.stringify(results));
    
    // Don't use the connection here, it has been returned to the pool.
  });
});
};