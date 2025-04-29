const verifySignUp = require('../verifySignUp');
const authJwt = require('../verifyJwtToken');

module.exports = function (app) {

	const controller = require('../controller/controller.js');
	const uploadhome = require('../config/home.upload.js');
    const uploads = require('../config/uploads.js');

    app.use(function (req, res, next) {
        //Enabling CORS
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Private-Network", "true")
        res.setHeader("Access-Control-Max-Age", "1800");
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization")
        next();
    });
    const cors = require('cors');
    app.use(cors({ origin: '*', credentials: true }));
    



    app.post('/api/auth/signin', controller.signin);
    app.get('/api/auth/AllMenusbyRole/:roles', controller.AllMenusbyRole);
    app.get('/api/auth/GetAllMenus', controller.GetAllMenus);
    app.get('/api/auth/GetAllCategories', controller.GetAllCategories);
    app.get('/api/auth/GetProductsbyFeature', controller.GetProductsbyFeature);
    app.get('/api/auth/GetrecentProduct', controller.GetrecentProduct);
    app.get('/api/auth/GetAllRoles', controller.GetAllRoles);
    app.get('/api/auth/GetMenupermissionbyrole/:role/:menuname', controller.GetMenupermissionbyrole);
    app.get('/api/auth/getPrintStatistics', controller.GetPrintStatistics);
    app.post('/api/auth/assignrolepermission', controller.AssignRolePermission);
    app.post('/api/auth/addrolepermission', controller.AddRolePermission);
    app.post("/api/auth/send-email", controller.sendEmail);
    app.post("/api/auth/order-email", controller.orderEmail);
    app.post("/api/auth/neworder-email", controller.neworderEmail);
    app.post("/api/auth/bookprint-email", controller.bookprintEmail);
    app.post("/api/auth/reset-password", controller.resetPassword );
    app.get('/api/auth/GetAllSliders', controller.GetAllSliders);
    app.get('/api/auth/FindSliders/:id', controller.FindSliders);
    app.get('/api/auth/FindPartners/:id', controller.FindPartners);
    app.get('/api/auth/GetRegReqListReviewer/:owner', controller.GetRegReqListReviewer);
    app.get('/api/auth/GetRegReqListPublisher/:reqid', controller.GetRegReqListPublisher);
    app.get('/api/auth/getPublisherData/:requestid', controller.getPublisherData);
    app.post('/api/auth/addPublisher', controller.AddPublisher);
    app.post('/api/auth/updateAboutus', controller.updateAboutus);
    app.post('/api/auth/updateFeaturedImage', uploadhome.any(), controller.updateFeaturedImage);
    app.post('/api/auth/uploadProduct', uploads.any(), controller.uploadProduct);
    app.post("/api/auth/updatePrintStatistics", controller.updatePrintStatistics );
    app.get('/api/auth/getProductListClient/:client_id', controller.getProductListClient);
    app.get('/api/auth/getProductList/:owner', controller.getProductList);
    app.get('/api/auth/getProductEditData/:requestid/:isbnnoEN', controller.getProductEditData);
    app.post('/api/auth/productApprovedUpdate', controller.productApprovedUpdate);
    app.post('/api/auth/addcustomer', controller.addcustomer);
    app.post('/api/auth/login', controller.login);
    app.get('/api/auth/getUsers', controller.getUsers);
    app.post('/api/auth/getUserById', controller.getUserById);
    app.post('/api/auth/getOrders', controller.getOrders);
    app.post('/api/auth/getOrderDetail', controller.getOrderDetail);
    app.post('/api/auth/getProducts', controller.getProducts);
    app.post('/api/auth/getProductsById', controller.getProductsById);
    app.post('/api/auth/placeOrder', controller.placeOrder);
    app.post('/api/auth/saveWishlist', controller.saveWishlist);
    app.get('/api/auth/getWishlist/:requestid', controller.getWishlist);
    app.delete('/api/auth/deleteWishlist/:prodId/:cusId', controller.deleteWishlist);
    app.post('/api/auth/getCustomerById', controller.getCustomerById);
    app.put('/api/auth/saveBillingAdd', controller.saveBillingAdd);
    app.put('/api/auth/saveShippingAdd', controller.saveShippingAdd);
    app.put('/api/auth/updateProfile', controller.updateProfile);
    app.post('/api/auth/addCusWithDetail', controller.addCusWithDetail);
    app.get('/api/auth/getOrderDetailByOrderId/:orderId', controller.getOrderDetailByOrderId);
    app.post('/api/auth/updateOrderStatus', controller.updateOrderStatus);
    app.post('/api/auth/updateHead', controller.updateHead);
    app.post('/api/auth/updateFooter', controller.updateFooter);
    app.post('/api/auth/getUserEmail', controller.getUserEmail);
}