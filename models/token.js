module.exports = (sequelize, Sequelize) => {
	const User = sequelize.define('token', {
	  userId: {
		  type: Sequelize.NUMBER,
          required: true
	  },
	  token: {
		  type: Sequelize.STRING,
          required: true
	  },
      createdAt: {
        type: Date,
        default: Date.now,
        expires: 300
    }
    });
	
	return Token;
}