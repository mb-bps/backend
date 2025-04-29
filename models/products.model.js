// SELECT * FROM menu LEFT JOIN rolepermission ON menu.code = rolepermission.menucode where rolepermission.userrole = 'user' && rolepermission.haveview

module.exports = (sequelize, Sequelize) => {
	const Products = sequelize.define('products', {
	//   catid: {
	// 	  type: sequelize.NUMBER
	//   },
	  captionEN: {
		  type: Sequelize.STRING
	  },
	  captioAR: {
		  type: Sequelize.STRING
	  },
	  descriptionEN: {
		  type: Sequelize.STRING
	  },
	  descriptionAR: {
		type: Sequelize.STRING
	  },
	  image: {
		  type: Sequelize.STRING
	  },
	  images: {
		type: Sequelize.STRING
	  },
	  price: {
		type: Sequelize.DOUBLE(18, 2)
	  },
	  discount: {
		type: Sequelize.DOUBLE(18, 2)
	  },
	  active: {
		type: Sequelize.BOOLEAN
	  },
	  featured: {
		type: Sequelize.BOOLEAN
	}
	});
	
	return Products;
}