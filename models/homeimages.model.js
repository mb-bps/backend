// SELECT * FROM menu LEFT JOIN rolepermission ON menu.code = rolepermission.menucode where rolepermission.userrole = 'user' && rolepermission.haveview

module.exports = (sequelize, Sequelize) => {
	const HomeImage = sequelize.define('home_images', {
	  name: {
		  type: Sequelize.STRING
	  },
	  image: {
		  type: Sequelize.STRING
	  }
	});
	
	return HomeImage;
}