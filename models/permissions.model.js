module.exports = (sequelize, Sequelize) => {
	const Permission = sequelize.define('rolepermission', {
	  userrole: {
		  type: Sequelize.STRING
	  },
	  menucode: {
		  type: Sequelize.STRING
	  },
	  menucodeAR: {
		type: Sequelize.STRING
	},
	  haveview: {
		  type: Sequelize.BOOLEAN
	  },
	  haveadd: {
		type: Sequelize.BOOLEAN
	},
	  haveedit: {
		  type: Sequelize.BOOLEAN
		},
	  havedelete: {
		  type: Sequelize.BOOLEAN
	  }	});
	
	return Permission;
}