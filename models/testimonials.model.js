// SELECT * FROM menu LEFT JOIN rolepermission ON menu.code = rolepermission.menucode where rolepermission.userrole = 'user' && rolepermission.haveview

module.exports = (sequelize, Sequelize) => {
	const Testimonials = sequelize.define('testimonials', {
	  nameEN: {
		  type: Sequelize.STRING
	  },
	  nameAR: {
		type: Sequelize.STRING
	},
	designationEN: {
		type: Sequelize.STRING
	},
	designationAR: {
		type: Sequelize.STRING
	},
	commentsEN: {
		type: Sequelize.STRING
	},
	commentsAR: {
		type: Sequelize.STRING
	},
	image: {
		  type: Sequelize.STRING
	}
	});
	
	return Testimonials;
}