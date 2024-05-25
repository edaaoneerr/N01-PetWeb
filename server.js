const mysql = require('mysql2');

// Create a connection pool
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '536050',
    database: 'petWebApp'
});

connection.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL');
});
module.exports = connection;
