// SELECT * FROM menu LEFT JOIN rolepermission ON menu.code = rolepermission.menucode where rolepermission.userrole = 'user' && rolepermission.haveview

module.exports = (sequelize, Sequelize) => {
	const Menu = sequelize.define('menus', {
	  code: {
		  type: Sequelize.STRING
	  },
	  codeAR: {
		type: Sequelize.STRING
	},
	  name: {
		  type: Sequelize.STRING
	  },
	  status: {
		  type: Sequelize.BOOLEAN
	  }
	});
	
	return Menu;
}