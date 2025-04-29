module.exports = (sequelize, Sequelize) => {
	const User = sequelize.define('users', {
	  name: {
		  type: Sequelize.STRING
	  },
	  username: {
		  type: Sequelize.STRING
	  },
	  usernameAR: {
		type: Sequelize.STRING
	},
	  email: {
		  type: Sequelize.STRING
	  },
	  phone: {
		type: Sequelize.STRING
	},
	  password: {
		  type: Sequelize.STRING
		},
	  isactive: {
		  type: Sequelize.BOOLEAN
	  },
 	  role: {
		type: Sequelize.STRING
	},
	requestID: {
		type: Sequelize.NUMBER
	},
	  islocked: {
		type: Sequelize.BOOLEAN
	},
	  failattempt: {
		type: Sequelize.NUMBER
	},
	  createdby: {
		type: Sequelize.STRING
	}
	});
	
	return User;
}