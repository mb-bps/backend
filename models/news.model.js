module.exports = (sequelize, Sequelize) => {
	const News = sequelize.define('news', {
	  captionEN: {
		  type: Sequelize.STRING
	  },
	  captionAR: {
		type: Sequelize.STRING
	},
	newsEN: {
		type: Sequelize.STRING
	},
	newsAR: {
		type: Sequelize.STRING
	},
	image: {
		  type: Sequelize.STRING
	}
	});
	
	return News;
}