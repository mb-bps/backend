const multer = require('multer');

var storage = multer.diskStorage({
	destination: (req, file, cb) => {
	  cb(null, __basedir + '/public/images/products')
	},
	filename: (req, file, cb) => {
	  cb(null, Date.now() + "-" + file.originalname);
	  console.log(file.fieldname);
	}
});

var uploads = multer({storage: storage});

module.exports = uploads;