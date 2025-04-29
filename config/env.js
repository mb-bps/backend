const env = {
  database: 'qds',
  username: 'root_bps',
  password: 'P@ssw0rd',
  host: 'moc-bps-mysql.mysql.database.azure.com',
  dialect: 'mysql',
  pool: {
	  max: 5,
	  min: 0,
	  acquire: 30000,
	  idle: 10000
  }
};
 
module.exports = env;
