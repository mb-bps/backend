const env = require('./env.js');
 
const Sequelize = require('sequelize');
const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  // operatorsAliases: false,
 
  pool: {
    max: env.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle
  }
});
 
const db = {};
 
db.Sequelize = Sequelize;
db.sequelize = sequelize;
 
db.user = require('../models/user.model.js')(sequelize, Sequelize);
db.menu = require('../models/menu.model.js')(sequelize, Sequelize);
db.rolepermission = require('../models/permissions.model.js')(sequelize, Sequelize);
db.categories = require('../models/categories.model.js')(sequelize, Sequelize);
db.products = require('../models/products.model.js')(sequelize, Sequelize);
db.home_images = require('../models/homeimages.model.js')(sequelize, Sequelize);
db.testimonials = require('../models/testimonials.model.js')(sequelize, Sequelize);
db.news = require('../models/news.model.js')(sequelize, Sequelize);
db.partners = require('../models/partners.model.js')(sequelize, Sequelize);
db.mainslider = require('../models/mainslider.model.js')(sequelize, Sequelize);

// db.role = require('../models/role.model.js')(sequelize, Sequelize);
// db.customer = require('../models/customer.model.js')(sequelize, Sequelize); 
// db.website = require('../models/website.model.js')(sequelize, Sequelize);
// db.email = require('../models/email.model.js')(sequelize, Sequelize);
// db.details = require('../models/details.model.js')(sequelize, Sequelize);
// db.invoice = require('../models/invoice.model.js')(sequelize, Sequelize);
// db.order = require('../models/order.model.js')(sequelize, Sequelize);
// db.orddetail = require('../models/orddetail.model.js')(sequelize, Sequelize);
// db.invhistories = require('../models/invhistory.model.js')(sequelize, Sequelize);
// db.uk = require('../models/uk.model.js')(sequelize, Sequelize);
// db.us = require('../models/us.model.js')(sequelize, Sequelize);

// db.role.belongsToMany(db.user, { through: 'user_roles', foreignKey: 'roleId', otherKey: 'userId'});
// db.user.belongsToMany(db.role, { through: 'user_roles', foreignKey: 'userId', otherKey: 'roleId'});
// db.customer.hasMany(db.website, {foreignKey: 'id', targetKey: 'website_id'});
// db.website.belongsTo(db.customer, {otherKey: 'website_id', targetKey: 'id'});
module.exports = db;