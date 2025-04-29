const mysql = require('mysql');
const db = mysql.createConnection({
  host: "moc-bps-mysql.mysql.database.azure.com",
  user: "root_bps",
  password: "P@ssw0rd",
  database: "qds",
  waitForConnections: true,
  connectionLimit: 10
})

module.exports = db; 