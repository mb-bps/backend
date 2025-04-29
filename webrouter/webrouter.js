module.exports = function (app) {

	const webcontroller = require('../webcontroller/webcontroller');
	// const packages = require('../controllers/package.controller.js');

	app.use(function (req, res, next) {
        //Enabling CORS
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Max-Age", "1800");
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization")
        next();
    });




app.get('/api/head', webcontroller.findAllHead);
app.get('/api/footer', webcontroller.findAllFooter);
app.get('/api/home', webcontroller.findAllHome);
app.get('/api/homeimages', webcontroller.findAllHomeImages);
app.get('/api/findAllTestimonials', webcontroller.findAllTestimonials);
app.get('/api/findAllNews', webcontroller.findAllNews);
app.get('/api/findAllPartners', webcontroller.findAllPartners);
app.post('/api/updAboutUs', webcontroller.updAboutUs);

}