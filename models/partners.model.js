// SELECT * FROM menu LEFT JOIN rolepermission ON menu.code = rolepermission.menucode where rolepermission.userrole = 'user' && rolepermission.haveview

module.exports = (sequelize, Sequelize) => {
	const Partners = sequelize.define('partners', {
	  id: {
		  type: Sequelize.NUMBER,
          primaryKey: true,
	  },
	  image: {
		type: Sequelize.STRING
	  }
	});
	
	return Partners;
}