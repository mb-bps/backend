const mysql = require('mysql');
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "qds",
  waitForConnections: true,
  connectionLimit: 10
})

module.exports = db; 