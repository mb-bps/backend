// SELECT * FROM menu LEFT JOIN rolepermission ON menu.code = rolepermission.menucode where rolepermission.userrole = 'user' && rolepermission.haveview

module.exports = (sequelize, Sequelize) => {
	const Mainslider = sequelize.define('mainslider', {
	//   catid: {
	// 	  type: sequelize.NUMBER
	//   },
	  image: {
		  type: Sequelize.STRING
	  },
	  titleEN: {
		  type: Sequelize.STRING
	  },
	  titleAR: {
		  type: Sequelize.STRING
	  },
	  title1EN: {
        type: Sequelize.STRING
    },
      title1AR: {
        type: Sequelize.STRING
    },
      title2EN: {
        type: Sequelize.STRING
    },
      title2AR: {
        type: Sequelize.STRING
    },

    });
	
	return Mainslider;
}