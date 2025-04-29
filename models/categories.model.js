// SELECT * FROM menu LEFT JOIN rolepermission ON menu.code = rolepermission.menucode where rolepermission.userrole = 'user' && rolepermission.haveview

module.exports = (sequelize, Sequelize) => {
	const Categories = sequelize.define('categories', {
	  captionEN: {
		  type: Sequelize.STRING
	  },
	  captioAR: {
		  type: Sequelize.STRING
	  },
	  image: {
		  type: Sequelize.STRING
	  }
	});
	
	return Categories;
}