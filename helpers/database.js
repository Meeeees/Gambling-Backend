const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    port: process.env.MYSQLPORT,
    database: process.env.MYSQL_DATABASE,
    password: process.env.MYSQL_ROOT_PASSWORD,
    connectionLimit: 10, // Adjust the limit based on your needs
    waitForConnections: true,
    queueLimit: 0
});

module.exports = pool;
