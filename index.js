global.__basedir = __dirname;

var express = require('express');
const mysql = require('mysql');
const env = require('./config/env.js');
const path = require('path');
const cors = require('cors');
var app = express();
app.use(cors());
app.use('/fonts', express.static(__dirname + '/public/fonts'));
app.use('/catImages', express.static(__dirname + '/public/images/categories'));
app.use('/prodImages', express.static(__dirname + '/public/images/products'));
app.use('/homeImages', express.static(__dirname + '/public/images/home'));
app.use('/sliderImages', express.static(__dirname + '/public/images/slider'));
app.use('/uploadsImages', express.static(__dirname + '/public/images/uploads'));
app.use('/pdfUrl', express.static(path.resolve(__dirname + '/public/images/products')));
var bodyParser = require('body-parser');
app.use(bodyParser.json())
global.__basedir = __dirname;
require('./webrouter/webrouter.js')(app);
require('./router/router.js')(app);
const db = require('./config/db.config.js');

var server = app.listen(8080, function () {

	var host = server.address().address
	var port = server.address().port

	console.log("App listening at https://moc-bp-dev-cqg2fha9bmd8gaf3.westeurope-01.azurewebsites.net")
})