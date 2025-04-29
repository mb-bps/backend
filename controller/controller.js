const env = require('../config/env.js');
const qry = require('../config/db.js');
const db = require('../config/db.config.js');
const config = require('../config/config.js');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
// var https = require('https');
const User = db.user;
const Menu = db.menu;
const Token = require('../models/token')
const Permission = db.rolepermission;
const Categories = db.categories;
const Products = db.products;
const { any } = require('../config/home.upload.js')

const Op = db.Sequelize.Op;
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
resetPasswordHeader = 'Hello World!';
const { response } = require('express');
// const { json } = require('sequelize');
// const { where } = require('sequelize');
resetPassSubjectAR = 'نسيت كلمة السر؟'
resetPassSubject = 'Reset Password'
exports.signin = (req, res) => {
	User.findOne({
		where: {
			email: req.body.email
		}
	}).then(user => {
		if (!user) {
			return res.status(404).send({ reason: 'User Not Found.' });
		}

		var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
		if (!passwordIsValid) {
			return res.status(401).send({ auth: false, accessToken: null, reason: 'Invalid Password!' });
		}

		var token = jwt.sign({ email: user.email, role: user.role, username: user.username, requestID: user.requestID }, config.secret, {
			expiresIn: 86400 // expires in 24 hours
		});
		res.status(200).send({
			auth: true,
			accessToken: token,
			username: user.username,
			email: user.email,
			phone: user.phone,
			role: user.role,
			requestID: user.requestID,
			islocked: user.islocked,
			isactive: user.isactive
		});
	})
}

exports.AllMenusbyRole = (req, res) => {
	let haveview = true;
	let ret = req.params.roles;
	const sql = "SELECT * FROM menus LEFT JOIN rolepermission ON menus.code = rolepermission.menucode where rolepermission.userrole = " + JSON.stringify(ret) + " && rolepermission.haveview = " + haveview;
	qry.query(sql, (err, data) => {
		if (err) return res.json("Error");
		return res.json(data);
	});
}


exports.GetAllMenus = (_req, res) => {
	const sql = "SELECT * FROM menus";
	qry.query(sql, (err, data) => {
		if (err) return res.json("Error");
		return res.json(data);
	});
}

exports.GetPrintStatistics = (_req, res) => {
	const sql = "SELECT * FROM printstats";
	qry.query(sql, (err, data) => {
		if (err) return res.json("Error");
		return res.json(data);
	});
}

exports.GetAllCategories = (_req, res) => {
	const sql = "SELECT * FROM categories";
	qry.query(sql, (err, data) => {
		if (err) return res.json("Error");
		return res.json(data);
	});
}

exports.GetProductsbyFeature = (_req, res) => {
	let featured = 1;
	const sql = "SELECT * FROM products WHERE products.featured = " + JSON.stringify(featured);
	qry.query(sql, (err, data) => {
		if (err) return res.json("Error");
		return res.json(data);
	});
}

exports.GetrecentProduct = (_req, res) => {
	const sql = "SELECT * FROM `products` ORDER BY id DESC LIMIT 20";
	qry.query(sql, (err, data) => {
		if (err) return res.json("Error");
		return res.json(data);
	});
}

exports.GetAllRoles = (_req, res) => {
	const sql = "SELECT * FROM role";
	qry.query(sql, (err, data) => {
		if (err) return res.json("Error");
		return res.json(data);
	});
}

exports.GetAllSliders = (_req, res) => {
	const sql = "SELECT * FROM mainslider";
	qry.query(sql, (err, data) => {
		if (err) return res.json("Error");
		return res.json(data);
	});
}

exports.FindSliders = (req, res) => {
	let cid = req.params.id;
	const sql = "SELECT * FROM mainslider where mainslider.id = " + JSON.stringify(cid);
	qry.query(sql, (err, data) => {
		if (err) return res.json("Error");
		return res.json(data);
	});
}

exports.FindPartners = (req, res) => {
	let cid = req.params.id;
	const sql = "SELECT * FROM partners where partners.id = " + JSON.stringify(cid);
	qry.query(sql, (err, data) => {
		if (err) return res.json("Error");
		return res.json(data);
	});
}

exports.GetMenupermissionbyrole = (req, res) => {
	let haveview = true;
	let roles = req.params.role;
	let menus = req.params.menuname;
	const sql = "SELECT * FROM `rolepermission` WHERE rolepermission.userrole = " + JSON.stringify(roles) + " && rolepermission.menucode = " + JSON.stringify(menus);
	qry.query(sql, (err, data) => {
		if (err) return res.json("Error");
		return res.json(data[0]);
	});
}

exports.GetRegReqListReviewer = (req, res) => {
	// let owner = 'Reviewer';
	let owner = req.params.owner
	// let rqid = req.params.reqid
	const sql = "SELECT * FROM request LEFT JOIN publisher ON request.created_id = publisher.id WHERE current_owner = " + JSON.stringify(owner);
	// const sql = "SELECT * FROM request WHERE current_owner = " + JSON.stringify(owner);
	qry.query(sql, (err, data) => {
		if (err) return res.json("Error");
		return res.json(data);
	});
}

exports.GetRegReqListPublisher = (req, res) => {
	// let owner = 'Reviewer';
	let owner = req.params.owner
	let rqid = req.params.reqid
	const sql = "SELECT * FROM request LEFT JOIN publisher ON publisher.id = " + JSON.stringify(rqid) + "WHERE created_id = " + JSON.stringify(rqid);
	// const sql = "SELECT * FROM request WHERE current_owner = " + JSON.stringify(owner);
	qry.query(sql, (err, data) => {
		if (err) return res.json("Error");
		return res.json(data);
	});
}

exports.getPublisherData = (req, res) => {
	let reqid = req.params.requestid
	const sql = "SELECT * FROM publisher INNER JOIN publisher_images ON publisher_images.request_id = publisher.id WHERE publisher.id = " + JSON.stringify(reqid)
	qry.query(sql, (err, data) => {
		if (err) return res.json("Error");
		return res.json(data);
	});
}

exports.AddRolePermission = (req, res) => {
	len = req.body.length;
	const sql = "INSERT into rolepermission(menucode, userrole, haveview, haveadd, haveedit, havedelete) VALUES ('" + req.body.code + "', '" + req.body.userrole + "', '0', '0', '0', '0')";
	qry.query(sql, (err, data) => {
		if (err) {
			res.send("Error")
			return
		}
	})
	res.send({ result: 'pass' });
}

exports.AssignRolePermission = async (req, res) => {
	len = req.body.length;
	for (i = 0; i <= len; i++) {
		if (i < len && req.body[i].userrole != undefined) {
			const sql = "UPDATE rolepermission set haveview = " + JSON.stringify(req.body[i].haveview) + ", haveadd = " + JSON.stringify(req.body[i].haveadd) + ", haveedit = " + JSON.stringify(req.body[i].haveedit) + ", havedelete = " + JSON.stringify(req.body[i].havedelete) + " WHERE userrole = " + JSON.stringify(req.body[i].userrole) + " && menucode = " + JSON.stringify(req.body[i].menucode);
			qry.query(sql, (err, data) => {
				if (err) {
					res.send("Error")
					return
				}
			});
		}
	}
	return res.send({ result: 'pass' });
}

exports.AddPublisher = (req, res) => {

	// const sql123 = "SELECT publisher_nameEN, official_emailEN, qid_numberEN FROM publisher WHERE publisher_nameEN = " + JSON.stringify(req.body._publisher_nameEN) + " && publisher.cofficial_emailEN = " + JSON.stringify(req.body._official_emailEN) + " && publisher.qid_numberEN = " + JSON.stringify(req.body._qid_numberEN);
	qry.query("SELECT COUNT(*) AS cnt FROM publisher WHERE publisher_nameEN = " + JSON.stringify(req.body._publisher_nameEN) + " && official_emailEN = " + JSON.stringify(req.body._official_emailEN) + " && qid_numberEN = " + JSON.stringify(req.body._qid_numberEN), function (err, result) {
		if (err) {
			console.log('Error ', err);
			return
		} else {
			if (result[0].cnt > 0) {
				console.log('Email Already Exist');
				return false;
			} else {
				let _account_type = req.body._account_type;
				let _first_nameEN = req.body._first_nameEN;
				let _publisher_nameEN = req.body._publisher_nameEN;
				let _last_nameEN = req.body._last_nameEN;
				let _contact_emailEN = req.body._contact_emailEN;
				let _contact_numberEN = req.body._contact_numberEN;
				let _passwordEN = bcrypt.hashSync(req.body._passwordEN, 8);
				let _qid_numberEN = req.body._qid_numberEN;
				let _qid_image = req.body._qid_image;
				let _reg_image = req.body._reg_image;
				let _official_emailEN = req.body._official_emailEN;
				let _official_contact_numberEN = req.body._official_contact_numberEN;
				let _official_websiteEN = req.body._official_websiteEN;
				let _legal_registration_documentEN = req.body._legal_registration_documentEN;
				let _license_numberEN = req.body._license_numberEN;
				let _license_expiry_dateEN = req.body._license_expiry_dateEN;
				let _address_streetEN = req.body._address_streetEN;
				let _address_cityEN = req.body._address_cityEN;
				let _address_stateEN = req.body._address_stateEN;
				let _address_zipEN = req.body._address_zipEN;
				let _address_countryEN = req.body._address_countryEN;
				let _additional_notesEN = req.body._additional_notesEN;
				let _first_nameAR = req.body._first_nameAR;
				let _publisher_nameAR = req.body._publisher_nameAR;
				let _last_nameAR = req.body._last_nameAR;
				let _contact_emailAR = req.body._contact_emailAR;
				let _contact_numberAR = req.body._contact_numberAR;
				let _passwordAR = req.body._passwordAR;
				let _qid_numberAR = req.body._qid_numberAR;
				let _official_emailAR = req.body._official_emailAR;
				let _official_contact_numberAR = req.body._official_contact_numberAR;
				let _official_websiteAR = req.body._official_websiteAR;
				let _legal_registration_documentAR = req.body._legal_registration_documentAR;
				let _license_numberAR = req.body._license_numberAR;
				let _license_expiry_dateAR = req.body._license_expiry_dateAR;
				let _address_streetAR = req.body._address_streetAR;
				let _address_cityAR = req.body._address_cityAR;
				let _address_stateAR = req.body._address_stateAR;
				let _address_zipAR = req.body._address_zipAR;
				let _address_countryAR = req.body._address_countryAR;
				let _additional_notesAR = req.body._additional_notesAR;
				let _acknowledgment = req.body._acknowledgment;
				let _status = req.body._status;

				const sql = "INSERT INTO Publisher(account_type, first_nameEN, publisher_nameEN, last_nameEN, contact_emailEN, contact_numberEN, passwordEN, qid_numberEN, official_emailEN, official_contact_numberEN, official_websiteEN, legal_registration_documentEN, license_numberEN, address_streetEN, address_cityEN, address_stateEN, address_zipEN, address_countryEN, additional_notesEN, first_nameAR, publisher_nameAR, last_nameAR, contact_emailAR, contact_numberAR, passwordAR, qid_numberAR, official_emailAR, official_contact_numberAR, official_websiteAR, legal_registration_documentAR, license_numberAR, address_streetAR, address_cityAR, address_stateAR, address_zipAR, address_countryAR, additional_notesAR, acknowledgment, status) VALUES ('" + _account_type + "', '" + _first_nameEN + "', '" + _publisher_nameEN + "', '" + _last_nameEN + "', '" + _contact_emailEN + "', '" + _contact_numberEN + "', '" + _passwordEN + "', '" + _qid_numberEN + "', '" + _official_emailEN + "', '" + _official_contact_numberEN + "', '" + _official_websiteEN + "', '" + _legal_registration_documentEN + "', '" + _license_numberEN + "', '" + _address_streetEN + "', '" + _address_cityEN + "', '" + _address_stateEN + "', '" + _address_zipEN + "', '" + _address_countryEN + "', '" + _additional_notesEN + "', '" + _first_nameAR + "', '" + _publisher_nameAR + "', '" + _last_nameAR + "', '" + _contact_emailAR + "', '" + _contact_numberAR + "', '" + _passwordAR + "', '" + _qid_numberAR + "', '" + _official_emailAR + "', '" + _official_contact_numberAR + "', '" + _official_websiteAR + "', '" + _legal_registration_documentAR + "', '" + _license_numberAR + "', '" + _address_streetAR + "', '" + _address_cityAR + "', '" + _address_stateAR + "', '" + _address_zipAR + "', '" + _address_countryAR + "', '" + _additional_notesAR + "', '" + _acknowledgment + "', '" + _status + "')";

				qry.query(sql, (err, data) => {
					if (err) {
						throw err;
					} else {
						var ltd = data;
						res.send({ result: 'pass' });
						// res.send();
					}
					const sql1 = "UPDATE publisher set created_by = " + JSON.stringify(ltd.insertId) + ", request_id = " + JSON.stringify('MOC-PR-' + ltd.insertId) + " WHERE id = " + JSON.stringify(ltd.insertId);
					qry.query(sql1, (err, data) => {
						if (err) {
							throw err;
						} else {
							res.send();
						}
						const sql2 = "INSERT INTO Request(request_id, request_type, created_id, created_by, response, response_note, updated_by, current_status, current_owner) VALUES ('" + 'MOC-PR-' + ltd.insertId + "', 'Publisher Registration', '" + ltd.insertId + "', '" + _publisher_nameEN + "', 'Pending', '', 0, '" + _status + "', 'Reviewer')";
						qry.query(sql2, (err, data) => {
							if (err) {
								throw err;
							} else {
								res.send();
							}
							const sql3 = "INSERT INTO publisher_images(request_id, qid_image, reg_image) VALUES ('" + ltd.insertId + "', '" + _qid_image + "', '" + _reg_image + "');";
							qry.query(sql3, (err, data) => {
								if (err) {
									throw err;
								} else {
									res.send();
								}
							});
							const sql4 = "INSERT INTO users(username, usernameAR, name, phone, email, password, isactive, role, requestID, islocked, failattempt, createdby) VALUES ('" + _first_nameEN + "', '" + _first_nameAR + "', '" + _publisher_nameEN + "', '" + _official_contact_numberEN + "', '" + _official_emailEN + "', '" + _passwordEN + "', 1, 'Publishing House (Externel)', " + ltd.insertId + ", 0, 0, '" + _publisher_nameEN + "');";
							qry.query(sql4, (err, data) => {
								if (err) {
									throw err;
								} else {
									res.send();
								}
							});
						});
					});
				})
			}
		}
	});
}

exports.updateAboutus = (req, res) => {
	let titleEN = req.body.titleEN;
	let titleAR = req.body.titleAR;
	let captionEN = req.body.contentEN;
	let captionAR = req.body.contentAR;
	const sql = "UPDATE home set en = " + JSON.stringify(titleEN) + ", ar = " + JSON.stringify(titleAR) + " WHERE id = " + JSON.stringify('1');
	qry.query(sql, (err, data) => {
		if (err) {
			throw err;
		} else {
			res.send({ result: 'pass' });
		}
		const sql1 = "UPDATE home set en = " + JSON.stringify(captionEN) + ", ar = " + JSON.stringify(captionAR) + " WHERE id = " + JSON.stringify('2');
		qry.query(sql1, (err, data) => {
			if (err) {
				throw err;
			} else {
				res.send();
			}
		});
	});
}

exports.updateHead = (req, res) => {

    let aboutusEN = req.body.aboutusEN;  
    let aboutusAR = req.body.aboutusAR;
    let booksEN = req.body.booksEN; 
    let booksAR = req.body.booksAR;
    let contactusEN = req.body.contactusEN;
    let contactusAR = req.body.contactusAR;
    let registerEN = req.body.registerEN;
    let registerAR = req.body.registerAR;
    let myaccountEN = req.body.myaccountEN;
    let myaccountAR = req.body.myaccountAR;
    let cartEN = req.body.cartEN;
    let cartAR = req.body.cartAR;
    let wishlistEN = req.body.wishlistEN;
    let wishlistAR = req.body.wishlistAR;
    let feedbackEN = req.body.feedbackEN;
    let feedbackAR = req.body.feedbackAR;
    let searchEN = req.body.searchEN;
    let searchAR = req.body.searchAR;

    const sql = "UPDATE head set en = " + JSON.stringify(aboutusEN) + ", ar = " + JSON.stringify(aboutusAR) + " WHERE id = " + JSON.stringify('1');
    qry.query(sql, (err, data) => {
        if (err) {
            throw err;
        } else {
            res.send({ result: 'pass' });
        }
        const sql1 = "UPDATE head set en = " + JSON.stringify(booksEN) + ", ar = " + JSON.stringify(booksAR) + " WHERE id = " + JSON.stringify('2');
        qry.query(sql1, (err, data) => {
            if (err) {
                throw err;
            } else {
                res.send();
            }
        });
        const sql2 = "UPDATE head set en = " + JSON.stringify(contactusEN) + ", ar = " + JSON.stringify(contactusAR) + " WHERE id = " + JSON.stringify('3');
        qry.query(sql2, (err, data) => {
            if (err) {
                throw err;
            } else {
                res.send();
            }
        });
        const sql3 = "UPDATE head set en = " + JSON.stringify(registerEN) + ", ar = " + JSON.stringify(registerAR) + " WHERE id = " + JSON.stringify('5');
        qry.query(sql3, (err, data) => {
            if (err) {
                throw err;
            } else {
                res.send();
            }
        });
        const sql4 = "UPDATE head set en = " + JSON.stringify(myaccountEN) + ", ar = " + JSON.stringify(myaccountAR) + " WHERE id = " + JSON.stringify('6');
        qry.query(sql4, (err, data) => {
            if (err) {
                throw err;
            } else {
                res.send();
            }
        });
        const sql5 = "UPDATE head set en = " + JSON.stringify(cartEN) + ", ar = " + JSON.stringify(cartAR) + " WHERE id = " + JSON.stringify('7');
        qry.query(sql5, (err, data) => {
            if (err) {
                throw err;
            } else {
                res.send();
            }
        });
        const sql6 = "UPDATE head set en = " + JSON.stringify(wishlistEN) + ", ar = " + JSON.stringify(wishlistAR) + " WHERE id = " + JSON.stringify('8');
        qry.query(sql6, (err, data) => {
            if (err) {
                throw err;
            } else {
                res.send();
            }
        });
        const sql7 = "UPDATE head set en = " + JSON.stringify(feedbackEN) + ", ar = " + JSON.stringify(feedbackAR) + " WHERE id = " + JSON.stringify('9');
        qry.query(sql7, (err, data) => {
            if (err) {
                throw err;
            } else {
                res.send();
            }
        });
        const sql8 = "UPDATE head set en = " + JSON.stringify(searchEN) + ", ar = " + JSON.stringify(searchAR) + " WHERE id = " + JSON.stringify('10');
        qry.query(sql8, (err, data) => {
            if (err) {
                throw err;
            } else {
                res.send();
            }
        });
    });
}

exports.updatePrintStatistics = (req, res) => {
	const sql = "UPDATE printstats set printerstatusEN = " + JSON.stringify(req.body.printerstatusEN) + ", printerstatusAR = " + JSON.stringify(req.body.printerstatusAR) + ", jobidEN = " + JSON.stringify(req.body.jobidEN) + ", jobidAR = " + JSON.stringify(req.body.jobidAR) + ", jobstatusEN = " + JSON.stringify(req.body.jobstatusEN) + ", jobstatusAR = " + JSON.stringify(req.body.jobstatusAR) + ", lastjobEN = " + JSON.stringify(req.body.lastjobEN) + ", lastjobAR = " + JSON.stringify(req.body.lastjobAR) + ", cyanEN = " + JSON.stringify(req.body.cyanEN) + ", cyanAR = " + JSON.stringify(req.body.cyanAR) + ", magentaEN = " + JSON.stringify(req.body.magentaEN) + ", magentaAR = " + JSON.stringify(req.body.magentaAR) + ", blackEN = " + JSON.stringify(req.body.blackEN) + ", blackAR = " + JSON.stringify(req.body.blackAR) + ", yellowEN = " + JSON.stringify(req.body.yellowEN) + ", yellowAR = " + JSON.stringify(req.body.yellowAR) + ", totalinkEN = " + JSON.stringify(req.body.totalinkEN) + ", totalinkAR = " + JSON.stringify(req.body.totalinkAR) + ", tonerstatusEN = " + JSON.stringify(req.body.tonerstatusEN) + ", tonerstatusAR = " + JSON.stringify(req.body.tonerstatusAR) + ", papercapacityEN = " + JSON.stringify(req.body.papercapacityEN) + ", papercapacityAR = " + JSON.stringify(req.body.papercapacityAR) + ", remainingpapertr1EN = " + JSON.stringify(req.body.remainingpapertr1EN) + ", remainingpapertr1AR = " + JSON.stringify(req.body.remainingpapertr1AR) + ", remainingpapertr2EN = " + JSON.stringify(req.body.remainingpapertr2EN) + ", remainingpapertr2AR = " + JSON.stringify(req.body.remainingpapertr2AR) + ", papersizetr1EN = " + JSON.stringify(req.body.papersizetr1EN) + ", papersizetr1AR = " + JSON.stringify(req.body.papersizetr1AR) + ", papersizetr2EN = " + JSON.stringify(req.body.papersizetr2EN) + ", papersizetr2AR = " + JSON.stringify(req.body.papersizetr2AR) + ", printmodeEN = " + JSON.stringify(req.body.printmodeEN) + ", printmodeAR = " + JSON.stringify(req.body.printmodeAR) + ", printspeedEN = " + JSON.stringify(req.body.printspeedEN) + ", printspeedAR = " + JSON.stringify(req.body.printspeedAR) + ", sheetprintedEN = " + JSON.stringify(req.body.sheetprintedEN) + ", sheetprintedAR = " + JSON.stringify(req.body.sheetprintedAR) + ", printdurationEN = " + JSON.stringify(req.body.printdurationEN) + ", printdurationAR = " + JSON.stringify(req.body.printdurationAR) + ", noofjobsEN = " + JSON.stringify(req.body.noofjobsEN) + ", noofjobsAR = " + JSON.stringify(req.body.noofjobsAR);
    qry.query(sql, (err, data) => {
        if (err) {
            throw err;
        } else {
            res.send({ result: 'pass' });
        }
	})
}

exports.updateFooter = (req, res) => {

    let ministryEN = req.body.ministryEN; 
    let ministryAR = req.body.ministryAR;
    let aboutusEN = req.body.aboutusEN;
    let aboutusAR = req.body.aboutusAR;
    let categoriesEN = req.body.categoriesEN;
    let categoriesAR = req.body.categoriesAR;
    let otherEN = req.body.otherEN;
    let otherAR = req.body.otherAR;
    let disclaimerEN = req.body.disclaimerEN;
    let disclaimerAR = req.body.disclaimerAR;
    let homeEN = req.body.homeEN;
    let homeAR = req.body.homeAR;
    let returnEN = req.body.returnEN;
    let returnAR = req.body.returnAR;
    let termsEN = req.body.termsEN;
    let termsAR = req.body.termsAR;
    let privacyEN = req.body.privacyEN;
    let privacyAR = req.body.privacyAR;
    let faqEN = req.body.faqEN;
    let faqAR = req.body.faqAR;
    let historyEN = req.body.historyEN;
    let historyAR = req.body.historyAR;
    let moviesEN = req.body.moviesEN;
    let moviesAR = req.body.moviesAR;
    let dramaEN = req.body.dramaEN;
    let dramaAR = req.body.dramaAR;
    let recipeEN = req.body.recipeEN;
    let recipeAR = req.body.recipeAR;
    let feedbackEN = req.body.feedbackEN; 
    let feedbackAR = req.body.feedbackAR;
    // let newslatterEN = req.body.newslatterEN;
    // let newslatterAR = req.body.newslatterAR;

    const sql = "UPDATE footer set en = " + JSON.stringify(ministryEN) + ", ar = " + JSON.stringify(ministryAR) + " WHERE id = " + JSON.stringify('1');
    qry.query(sql, (err, data) => {
        if (err) {
            throw err;
        } else {
            res.send({ result: 'pass' });
        }
        const sql1 = "UPDATE footer set en = " + JSON.stringify(aboutusEN) + ", ar = " + JSON.stringify(aboutusAR) + " WHERE id = " + JSON.stringify('2');
        qry.query(sql1, (err, data) => {
            if (err) {
                throw err;
            } else {
                res.send();
            }
        });
        const sql2 = "UPDATE footer set en = " + JSON.stringify(categoriesEN) + ", ar = " + JSON.stringify(categoriesAR) + " WHERE id = " + JSON.stringify('3');
        qry.query(sql2, (err, data) => {
            if (err) {
                throw err;
            } else {
                res.send();
            }
        });
        const sql3 = "UPDATE footer set en = " + JSON.stringify(otherEN) + ", ar = " + JSON.stringify(otherAR) + " WHERE id = " + JSON.stringify('4');
        qry.query(sql3, (err, data) => {
            if (err) {
                throw err;
            } else {
                res.send();
            }
        });
        const sql4 = "UPDATE footer set en = " + JSON.stringify(disclaimerEN) + ", ar = " + JSON.stringify(disclaimerAR) + " WHERE id = " + JSON.stringify('5');
        qry.query(sql4, (err, data) => {
            if (err) {
                throw err;
            } else {
                res.send();
            }
        });
        const sql5 = "UPDATE footer set en = " + JSON.stringify(homeEN) + ", ar = " + JSON.stringify(homeAR) + " WHERE id = " + JSON.stringify('6');
        qry.query(sql5, (err, data) => {
            if (err) {
                throw err;
            } else {
                res.send();
            }
        });
        const sql6 = "UPDATE footer set en = " + JSON.stringify(returnEN) + ", ar = " + JSON.stringify(returnAR) + " WHERE id = " + JSON.stringify('7');
        qry.query(sql6, (err, data) => {
            if (err) {
                throw err;
            } else {
                res.send();
            }
        });
        const sql7 = "UPDATE footer set en = " + JSON.stringify(termsEN) + ", ar = " + JSON.stringify(termsAR) + " WHERE id = " + JSON.stringify('8');
        qry.query(sql7, (err, data) => {
            if (err) {
                throw err;
            } else {
                res.send();
            }
        });
        const sql8 = "UPDATE footer set en = " + JSON.stringify(privacyEN) + ", ar = " + JSON.stringify(privacyAR) + " WHERE id = " + JSON.stringify('9');
        qry.query(sql8, (err, data) => {
            if (err) {
                throw err;
            } else {
                res.send();
            }
        });
        const sql9 = "UPDATE footer set en = " + JSON.stringify(faqEN) + ", ar = " + JSON.stringify(faqAR) + " WHERE id = " + JSON.stringify('10');
        qry.query(sql9, (err, data) => {
            if (err) {
                throw err;
            } else {
                res.send();
            }
        });
        const sql10 = "UPDATE footer set en = " + JSON.stringify(historyEN) + ", ar = " + JSON.stringify(historyAR) + " WHERE id = " + JSON.stringify('11');
        qry.query(sql10, (err, data) => {
            if (err) {
                throw err;
            } else {
                res.send();
            }
        });
        const sql11 = "UPDATE footer set en = " + JSON.stringify(moviesEN) + ", ar = " + JSON.stringify(moviesAR) + " WHERE id = " + JSON.stringify('12');
        qry.query(sql11, (err, data) => {
            if (err) {
                throw err;
            } else {
                res.send();
            }
        });
        const sql12 = "UPDATE footer set en = " + JSON.stringify(dramaEN) + ", ar = " + JSON.stringify(dramaAR) + " WHERE id = " + JSON.stringify('13');
        qry.query(sql12, (err, data) => {
            if (err) {
                throw err;
            } else {
                res.send();
            }
        });
        const sql13 = "UPDATE footer set en = " + JSON.stringify(recipeEN) + ", ar = " + JSON.stringify(recipeAR) + " WHERE id = " + JSON.stringify('14');
        qry.query(sql13, (err, data) => {
            if (err) {
                throw err;
            } else {
                res.send();
            }
        });
        const sql14 = "UPDATE footer set en = " + JSON.stringify(feedbackEN) + ", ar = " + JSON.stringify(feedbackAR) + " WHERE id = " + JSON.stringify('15');
        qry.query(sql14, (err, data) => {
            if (err) {
                throw err;
            } else {
                res.send();
            }
        });
        // const sql15 = "UPDATE footer set en = " + JSON.stringify(newslatterEN) + ", ar = " + JSON.stringify(newslatterAR) + " WHERE id = " + JSON.stringify('16');
        // qry.query(sql15, (err, data) => {
        //  if (err) {
        //      throw err;
        //  } else {
        //      res.send();
        //  }
        // });

    });
}



exports.updateFeaturedImage = (req, res) => {
	image = req.files[0].filename;
	const sql = "UPDATE home_images set image = " + JSON.stringify(image) + " WHERE id = " + JSON.stringify('1');
	qry.query(sql, (err, data) => {
		if (err) {
			throw err;
		} else {
			res.send({ result: 'pass' });
		}
	});
}

exports.uploadProduct = (req, res) => {
	bookimage = req.files[0].filename;
	titleimage = req.files[1].filename;
	previewimage = req.files[2].filename;
	const sql = "INSERT INTO productsapproval(pdf, image, pdf1, booknameEN, booknameAR, booktitleEN, booktitleAR, bookpreviewEN, bookpreviewAR, authornameEN, authornameAR, catidEN, catidAR, booklanguageEN, booklanguageAR, bookpagesEN, bookpagesAR, priceEN, priceAR, isbnnoEN, isbnnoAR, publishingyearEN, publishingyearAR, publishingdateEN, publishingdateAR, ldnumberEN, ldnumberAR, bookdescEN, bookdescAR, isprinting, status, owner, client_id, client_type, type) VALUES ('" + bookimage + "', '" + titleimage + "', '" + previewimage + "', '" + req.body.booknameEN + "', '" + req.body.booknameAR + "', '" + req.body.booktitleEN + "', '" + req.body.booktitleAR + "', '" + req.body.bookpreviewEN + "', '" + req.body.bookpreviewAR + "', '" + req.body.authornameEN + "', '" + req.body.authornameAR + "', '" + req.body.catidEN + "', '" + req.body.catidAR + "', '" + req.body.booklanguageEN + "', '" + req.body.booklanguageAR + "', '" + req.body.bookpagesEN + "', '" + req.body.bookpagesAR + "', '" + req.body.priceEN + "', '" + req.body.priceAR + "', '" + req.body.isbnnoEN + "', '" + req.body.isbnnoAR + "', '" + req.body.publishingyearEN + "', '" + req.body.publishingyearAR + "', '" + req.body.publishingdateEN + "', '" + req.body.publishingdateAR + "', '" + req.body.ldnumberEN + "', '" + req.body.ldnumberAR + "', '" + req.body.bookdescEN + "', '" + req.body.bookdescAR + "', '" + req.body.isprinting + "', '" + req.body.status + "', '" + req.body.owner + "', '" + req.body.client_id + "', '" + req.body.client_type + "', '" + req.body.type + "');";
	qry.query(sql, (err, data) => {
		if (err) {
			throw err;
		} else {
			res.send({ result: 'pass' });
		}
	});
}

exports.getProductListClient = (req, res) => {
	let client_id = req.params.client_id
	const sql = "SELECT * FROM productsapproval WHERE productsapproval.isbnnoEN != 'null' && productsapproval.client_id = " + JSON.stringify(req.params.client_id);
	qry.query(sql, (err, data) => {
		if (err) return res.json("Error");
		return res.json(data);
	});
}

exports.getProductList = (req, res) => {
	// let client_id = req.params.client_id
	const sql = "SELECT * FROM productsapproval WHERE productsapproval.isbnnoEN != 'null' && productsapproval.owner = " + JSON.stringify(req.params.owner);
	qry.query(sql, (err, data) => {
		if (err) return res.json("Error");
		return res.json(data);
	});
}

exports.getProductEditData = (req, res) => {
	// let requestid = req.params.client_id
	const sql = "SELECT * FROM productsapproval WHERE productsapproval.id = " + JSON.stringify(req.params.requestid) + " && productsapproval.isbnnoEN = " + JSON.stringify(req.params.isbnnoEN);
	qry.query(sql, (err, data) => {
		if (err) return res.json("Error");
		return res.json(data);
	});
}

exports.productApprovedUpdate = (req, res) => {
	let status = 'Approved';

	const sql = "UPDATE productsapproval set status = 'Approved' WHERE productsapproval.id = " + JSON.stringify(req.body.requestid) + " && productsapproval.isbnnoEN = " + JSON.stringify(req.body.isbnnoEN);
	qry.query(sql, (err, data) => {
		if (err) {
			throw err;
		} else {
			res.send();
		}

		const sql1 = "INSERT INTO products(catidEN, catidAR, booknameEN, booknameAR, booktitleEN, booktitleAR, bookpreviewEN, bookpreviewAR, authornameEN, authornameAR, booklanguageEN, booklanguageAR, bookpagesEN, bookpagesAR, isbnnoEN, isbnnoAR, publishingyearEN, publishingyearAR, ldnumberEN, ldnumberAR, bookdescEN, bookdescAR, isprinting, image, pdf, pdf1, priceEN, priceAR, client_id, client_type, type, status) VALUES ('" + req.body.data.catidEN + "', '" + req.body.data.catidAR + "', '" + req.body.data.booknameEN + "', '" + req.body.data.booknameAR + "', '" + req.body.data.booktitleEN + "', '" + req.body.data.booktitleAR + "', '" + req.body.data.bookpreviewEN + "', '" + req.body.data.bookpreviewAR + "', '" + req.body.data.authornameEN + "', '" + req.body.data.authornameAR + "', '" + req.body.data.booklanguageEN + "', '" + req.body.data.booklanguageAR + "', '" + req.body.data.bookpagesEN + "', '" + req.body.data.bookpagesAR + "', '" + req.body.data.isbnnoEN + "', '" + req.body.data.isbnnoAR + "', '" + req.body.data.publishingyearEN + "', '" + req.body.data.publishingyearAR + "', '" + req.body.data.ldnumberEN + "', '" + req.body.data.ldnumberAR + "', '" + req.body.data.bookdescEN + "', '" + req.body.data.bookdescAR + "', '" + req.body.data.isprinting + "', '" + req.body.data.image + "', '" + req.body.data.pdf + "', '" + req.body.data.pdf1 + "', '" + req.body.data.priceEN + "', '" + req.body.data.priceAR + "', '" + req.body.data.client_id + "', '" + req.body.data.client_type + "', '" + req.body.data.type + "', 'Approved' )";
		qry.query(sql1, (err, data) => {
			if (err) {
				throw err;
			} else {
				res.send();
			}
		});
	});
}

exports.sendEmail = async (req, res) => {
	const lang = req.body.lang;
	const user = await User.findOne({
		where: {
			email: req.body.email
		},
	})
	if (!user) {
		return res.send('Email Not Found.');
	}
	const payload = {
		email: user.email,
		username: user.username
	}
	const expiryTime = 500;
	const token = jwt.sign(payload, config.secret, { expiresIn: expiryTime });
	const newToken = { userId: user.id, token: token };
	if (lang == 'en') {
		sendEmail(user.email, 'Reset Password Request', 'resetpassMessage', { userName: user.username, URL: config.LIVE_URL, Token: token, header: resetPassSubject })
	} else {
		sendEmail(user.email, 'إعادة تعيين كلمة المرور', 'resetpassMessageAR', { userName: user.usernameAR, URL: config.LIVE_URL, Token: token, header: resetPassSubjectAR })
	}
	if (res.statusCode == 500) {
		return res.status(500).send({ message: "Something went wrong while sending the email" });
	} else {
		return res.status(200).send({ message: "Email Sent Successfully!" });
	}
}

exports.orderEmail = async (req, res) => {
	const lang = req.body.lang;
	const select = req.body.selectedValue;
	const orderno = req.body.orderNo
	const user = await User.findOne({
		where: {
			email: req.body.email
		},
	})
	if (!user) {
		return res.send('Email Not Found.');
	}
	const payload = {
		email: user.email,
		username: user.username,
		select: select,
		orderno: orderno
	}

	if (lang == 'en') {
		sendEmail1(user.email, 'Order Status Changed', 'orderStatus', { userName: user.username, select: select, orderno: orderno, URL: config.BACKEND_URL})
	} 
	// else {
	// 	sendEmail(user.email, 'إعادة تعيين كلمة المرور', 'resetpassMessageAR', { userName: user.usernameAR, URL: config.LIVE_URL, Token: token, header: resetPassSubjectAR })
	// }
	if (res.statusCode == 500) {
		return res.status(500).send({ message: "Something went wrong while sending the email" });
	} else {
		return res.status(200).send({ message: "Email Sent Successfully!" });
	}
}

exports.neworderEmail = async (req, res) => {
	const lang = req.body.lang;
	const user = await User.findOne({
		where: {
			email: req.body.email
		},
	})
	if (!user) {
		return res.send('Email Not Found.');
	}
	const payload = {
		email: user.email,
		username: user.username
	}

	if (lang == 'en') {
		sendEmail1(user.email, 'New Order Alert! ', 'orderNew', { userName: user.username, URL: config.BACKEND_URL})
	} 
	// else {
	// 	sendEmail(user.email, 'إعادة تعيين كلمة المرور', 'resetpassMessageAR', { userName: user.usernameAR, URL: config.LIVE_URL, Token: token, header: resetPassSubjectAR })
	// }
	if (res.statusCode == 500) {
		return res.status(500).send({ message: "Something went wrong while sending the email" });
	} else {
		return res.status(200).send({ message: "Email Sent Successfully!" });
	}
}

exports.bookprintEmail = async (req, res) => {
	const lang = req.body.lang;
	const user = await User.findOne({
		where: {
			email: req.body.email
		},
	})
	if (!user) {
		return res.send('Email Not Found.');
	}
	const payload = {
		email: user.email,
		username: user.username
	}

	if (lang == 'en') {
		sendEmail1(user.email, 'Welcome to Book Printing Solution! ', 'bookPrint', { userName: user.username, URL: config.BACKEND_URL})
	} 
	// else {
	// 	sendEmail(user.email, 'إعادة تعيين كلمة المرور', 'resetpassMessageAR', { userName: user.usernameAR, URL: config.LIVE_URL, Token: token, header: resetPassSubjectAR })
	// }
	if (res.statusCode == 500) {
		return res.status(500).send({ message: "Something went wrong while sending the email" });
	} else {
		return res.status(200).send({ message: "Email Sent Successfully!" });
	}
}

exports.resetPassword = (req, res, next) => {
	const token = req.body.token;
	const newPassword = req.body.password;
	jwt.verify(token, config.secret, async (err, data) => {
		if (err) {
			return res.status(403).send({ message: 'Reset Link is Expired!' });
		} else {
			const response = data;
			const user = await User.findOne({
				where: {
					email: response.email
				},
			})
			const salt = await bcrypt.genSalt(10);
			const encryptedPassword = await bcrypt.hash(newPassword, salt);
			user.password = encryptedPassword;
			try {
				User.update({
					password: user.password,
				}, {
					where: {
						email: response.email
					}
				})
				return res.status(200).send({ message: 'Password Reset Success!' });
			} catch (error) {
				return res.status(500).send({ message: 'Something went wrong while resetting the password!' });
			}
		}
	})
}

const transporter = nodemailer.createTransport({
	host: config.HOST,
	port: config.PORT,
	secure: true,
	auth: {
		user: config.EMAIL,
		pass: config.PASSWORD,
	}
})

// Configure Handlebars plugin in Nodemailer
const hbsOptions = {
	viewEngine: {
		partialsDir: 'views',
		layoutsDir: 'views',
		defaultLayout: 'baseMessage'
	},
	viewPath: 'views'
}

transporter.use('compile', hbs(hbsOptions))

function sendEmail(to, subject, template, context) {
	//Configure email options like from, to, subject, message, attachments, template...
	const mailOptions = {
		from: '<bps@dalda.pk>',
		to,
		subject,
		template,
		context,
		attachments: [
			{
				filename: 'logo.png',
				path: 'assets/images/logo.png',
				cid: 'logo'
			},
			{
				filename: '___passwordreset.gif',
				path: 'assets/images/___passwordreset.gif',
				cid: 'animated'
			},
			{
				filename: 'facebook2x.png',
				path: 'assets/images/facebook2x.png',
				cid: 'facebook'
			},
			{
				filename: 'instagram2x.png',
				path: 'assets/images/instagram2x.png',
				cid: 'instagram'
			},
			{
				filename: 'linkedin2x.png',
				path: 'assets/images/linkedin2x.png',
				cid: 'linkedin'
			},
			{
				filename: 'twitter2x.png',
				path: 'assets/images/twitter2x.png',
				cid: 'twitter'
			},
		]
	}
	// Send email options using the transporter
	transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.error('Error sending email:', err);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

function sendEmail1(to, subject, template, context) {
	//Configure email options like from, to, subject, message, attachments, template...
	const mailOptions = {
		from: '<bps@dalda.pk>',
		to,
		subject,
		template,
		context,
		attachments: [
			{
				filename: 'logo.png',
				path: 'assets/images/logo.png',
				cid: 'logo'
			},
			{
				filename: 'facebook2x.png',
				path: 'assets/images/facebook2x.png',
				cid: 'facebook'
			},
			{
				filename: 'instagram2x.png',
				path: 'assets/images/instagram2x.png',
				cid: 'instagram'
			},
			{
				filename: 'linkedin2x.png',
				path: 'assets/images/linkedin2x.png',
				cid: 'linkedin'
			},
			{
				filename: 'twitter2x.png',
				path: 'assets/images/twitter2x.png',
				cid: 'twitter'
			},
		]
	}
	// Send email options using the transporter
	transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.error('Error sending email:', err);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

// --- moin work ---
exports.addcustomer = (req, res) => {
	const {
		first_name_en, last_name_en, gender_en, email, phone,
		password, acknowledgment, subscribe,
		first_name_ar, last_name_ar, gender_ar } = req.body;

	try {
		const checkCustomerQuery = "SELECT * FROM customer WHERE email_en = " + JSON.stringify(email);
		qry.query(checkCustomerQuery, async (err, results) => {
			if (err) {
				return res.status(400).json({ message: "Database error", error: err });
			}
			if (results.length > 0) {
				return res.status(400).json({ message: "User already exists with the same email" });
			}
			const hashedPassword = await bcrypt.hash(password, 10);
			const insertCustomerQuery = "INSERT INTO customer (first_name_en, last_name_en, gender_en, email_en, phone_en, password_en, acknowledgment, subscribe, first_name_ar, last_name_ar, gender_ar, updated_by) VALUES ('" + first_name_en + "','" + last_name_en + "','" + gender_en + "','" + email + "','" + phone + "','" + hashedPassword + "','" + acknowledgment + "','" + subscribe + "','" + first_name_ar + "','" + last_name_ar + "','" + gender_ar + "','" + first_name_en + "')";
			qry.query(insertCustomerQuery, async (cusErr, cusResult) => {
				if (cusErr) {
					return res.status(400).json({ message: "Database error", error: cusErr });
				}

				const userId = cusResult.insertId;
				const insertUserQuery = "INSERT INTO users(username, usernameAR, name, phone, email, password, isactive, role, requestID, islocked, failattempt, createdby) VALUES ('" + first_name_en + "', '" + first_name_ar + "', '" + first_name_en + "', '" + phone + "', '" + email + "', '" + hashedPassword + "', 1, 'Customer (External)', " + cusResult.insertId + ", 0, 0, '" + first_name_en + "');";
				qry.query(insertUserQuery, async (userError, userRes) => {
					if (userError) {
						return res.status(400).json({ message: "Database error", error: userError });
					}
					const newUser = {
						id: userId,
						first_name_en,
						gender_en,
						email,
						phone,
						hashedPassword
					};
					return res.status(200).json({ message: "User registered successfully, please login ", newUser });
				});
			});
		});

	} catch (error) {
		return res.status(400).json({ message: "Server error", error });
	}
};

exports.login = (req, res) => {
	const { email, password } = req.body;
	const query = "SELECT * FROM users WHERE email = " + JSON.stringify(email);
	qry.query(query, async (err, results) => {
		if (err) return res.status(500).json({ message: "Database error" });
		if (results.length === 0) {
			return res.status(401).send({ message: "Invalid credentials" });
		}
		const user = results[0];
		const passwordIsValid = bcrypt.compareSync(password, user.password);
		if (!passwordIsValid) {
			return res.status(401).send({ auth: false, accessToken: null, reason: 'Invalid Password!' });
		}
		var token = jwt.sign({ email: user.email, role: user.role, username: user.username, requestID: user.requestID, id: user.id }, config.secret, {
			expiresIn: 86400
		});
		return res.status(200).json({ message: "Login Successfully...!", token, user: { id: user.id, email: user.email } });
	});
};

exports.getUsers = (_req, res) => {
	const userQuery = "SELECT * FROM users";
	qry.query(userQuery, (err, data) => {
		if (err) return res.status(400).json("Database Error...!");
		return res.status(200).json(data);
	});
}

exports.getUserById = (req, res) => {
	const { customerId } = req.body;
	const sql = "SELECT * FROM customer where user_id = " + customerId;
	qry.query(sql, (err, data) => {
		if (err) return res.status(400).json("Database Error...!");
		return res.status(200).json(data);
	});
}

exports.getOrders = (_req, res) => {
	const { customerId } = _req.body;
	let orderQuery = "";
	if(customerId)
	   orderQuery = "SELECT * FROM orders WHERE cusId = " + customerId;
	else
	   orderQuery = "SELECT * FROM orders";
	qry.query(orderQuery, (err, data) => {
		if (err) return res.status(400).json("Database Error...!");
		return res.status(200).json(data);
	});
}

exports.getOrderDetail = (_req, res) => {
	const { customerId } = _req.body;
	let orderDetailQuery = "";
	if(customerId)
	   orderDetailQuery = "SELECT * FROM orderdetail WHERE cusId = " + customerId;
	else
	   orderDetailQuery = "SELECT * FROM orderdetail";
	qry.query(orderDetailQuery, (err, data) => {
		if (err) return res.status(400).json("Database Error...!");
		return res.status(200).json(data);
	});
}

exports.getOrderDetailByOrderId = (_req, res) => {
	const orderId  = _req.params?.orderId;
	const orderDetailQuery = `SELECT od.*, p.*
        FROM orderdetail od
        LEFT JOIN products p ON od.prodId = p.id
        WHERE od.orderId =  ${orderId}`;
	// const orderDetailQuery = "SELECT * FROM orderdetail WHERE orderId = " + orderId;
	qry.query(orderDetailQuery, (err, data) => {
		if (err) return res.status(400).json("Database Error...!");
		return res.status(200).json(data);
	});
}

exports.getProducts = (_req, res) => {
	const { minPrice, maxPrice, cateId } = _req.body;
	let productsQuery;
	if(cateId){
		productsQuery = "SELECT * FROM products WHERE priceEN BETWEEN " + minPrice + " AND " + maxPrice + " AND catidEN = " + cateId + "";
	} else {
		productsQuery = "SELECT * FROM products WHERE priceEN BETWEEN " + minPrice + " AND " + maxPrice + "";
	}
	qry.query(productsQuery, (err, data) => {
		if (err) return res.status(404).json("Database Error...!");
		return res.status(200).json(data);
	});
}

exports.getProductsById = (req, res) => {
	const { productId } = req.body;
	const productsQuery = "SELECT * FROM products where id = " + productId;
	qry.query(productsQuery, (err, data) => {
		if (err) return res.status(400).json("Database Error...!");
		return res.status(200).json(data);
	});
}

exports.placeOrder = (req, _res) => {
	const { customerId, customerName, orderNo, totalAmt, productLst, orderType } = req.body;
	if (!customerId || !totalAmt || !productLst?.length)
		return _res.status(400).json({ error: "Missing required fields" });

	try {
		const orderQry = "INSERT INTO orders (orderNo, cusId, orderType, orderTotal, createdBy, order_status) VALUES ('" + orderNo + "', '" + customerId + "',  '" + orderType + "' ,'" + totalAmt + "', '" + customerName + "', 'Pending')";
		qry.query(orderQry, async (err, res) => {
			if (err)
				return _res.status(500).json({ error: "Order Not Place", details: err });
			
			let orderId = res.insertId;
			const orderDetails = productLst.map(({ booknameEN, booknameAR, authornameEN, authornameAR, isbnnoEN, isbnnoAR, quantity, priceEN, subTotal, id, pdf }) => 
				[orderId, customerId, booknameEN, booknameAR, authornameEN, authornameAR, isbnnoEN, isbnnoAR, quantity, priceEN, subTotal ,customerName, id, pdf]
			);
			const orderDetailQry = `INSERT INTO orderdetail (orderId, cusId, productName_en, productName_ar, author_en, author_ar, isbno_en, isbno_ar, quantity, price, total, createdBy, prodId, pdf) 
									VALUES ?`;
	
			qry.query(orderDetailQry, [orderDetails], (err, result) => {
				if (err) {
					return _res.status(500).json({ error: "Order Details Not Inserted", details: err });
				}
	
				_res.status(200).json({ message: "Order placed successfully!", orderId, orderNo });
			});
		});
	} catch (error) {
		return _res.status(500).json({ message: "Server error", error });
	}
};

exports.saveWishlist = (req, res) => {
	const { cusId, prodId, customerName } = req.body;
    if (!cusId || !prodId || !customerName)
        return res.status(400).json({ error: "Missing Required Fields...!" });

    const query = "INSERT INTO wishlist (cusId, prodId, status_list, updatedBy) VALUES ('" + cusId + "', '" + prodId + "', 'Active', '" + customerName + "')";
    qry.query(query, (err, result) => {
        if (err) return res.status(400).json({ error: "Database Error...!", details: err });
		
        return res.status(200).json({ message: "Wishlist Item Added Successfully...!", wishlistId: result.insertId });
    });
}

exports.getWishlist = (req, res) => { 
    const { customerId } = req.params; // Fixing request param extraction
    let orderQuery = `
        SELECT w.*, p.*
        FROM wishlist w
        LEFT JOIN products p ON w.prodId = p.id
        ${customerId ? "WHERE w.cusId = ?" : ""}
    `;
    qry.query(orderQuery, customerId ? [customerId] : [], (err, results) => {
        if (err) return res.status(500).json({ message: "Error fetching wishlist", error: err });
        return res.status(200).json(results);
    });
};

exports.deleteWishlist = (_req, res) => {
    const query = `DELETE FROM wishlist WHERE prodId = ${_req.params?.prodId} && cusId = ${_req.params?.cusId}`;
    qry.query(query, (err, result) => {
        if (err) {
            return res.status(500).json({ message: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Wishlist Item Not Found...!' });
        }

        return res.status(200).json({ message: 'Wishlist Item Deleted Successfully...!' });
    });
}

exports.getCustomerById = (req, res) => {
    const { customerId } = req.body;
    const query = "SELECT * FROM customer WHERE user_id = " + customerId;
    qry.query(query, (err, result) => {
        if (err) return res.status(400).json(err);
        return res.status(200).json(result);
    });
};

exports.saveBillingAdd = (req, res) => {
    const { user_id, state_or, state_or_ar, zip_code_or, zip_code_or_ar, street_add_or, 
		street_add_or_ar, city_or, city_or_ar, country_or, country_or_ar } = req.body;
	
	const query = "UPDATE customer SET state_or = ?, state_or_ar = ?, zip_code_or = ?, zip_code_or_ar = ?, street_add_or = ?, street_add_or_ar = ?, city_or = ?, city_or_ar = ?, country_or = ?, country_or_ar = ? WHERE user_id = ?";
	qry.query(query, [state_or, state_or_ar, zip_code_or, zip_code_or_ar, street_add_or, street_add_or_ar, city_or, city_or_ar, country_or, country_or_ar, user_id ], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.code });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Customer Not Found...!' });
        }

       	return res.status(200).json({ message: 'Customer Billing Address Successfully...!' });
    });
};

exports.saveShippingAdd = (req, res) => {
    const { user_id, zip_code_ship, zip_code_ship_ar, street_add_ship, street_add_ship_ar, state_ship, 
		state_ship_ar, city_ship, city_ship_ar, country_ship, country_ship_ar } = req.body;
	
	const query = "UPDATE customer SET zip_code_ship = ?, zip_code_ship_ar = ?, street_add_ship = ?, street_add_ship_ar = ?, state_ship = ?, state_ship_ar = ?, city_ship = ?, city_ship_ar = ?, country_ship = ?, country_ship_ar = ? WHERE user_id = ?";
	qry.query(query, [zip_code_ship, zip_code_ship_ar, street_add_ship, street_add_ship_ar, state_ship, state_ship_ar, city_ship, city_ship_ar, country_ship, country_ship_ar, user_id ], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.code });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Customer Not Found...!' });
        }

       	return res.status(200).json({ message: 'Customer Shipping Address Successfully...!' });
    });
};

exports.updateProfile = (req, res) => {
    const { user_id, first_name_en, last_name_en, email_en, phone_en, gender_en, 
		password_en, first_name_ar, last_name_ar, gender_ar } = req.body;
	
	const query = "UPDATE customer SET first_name_en = ?, last_name_en = ?, email_en = ?, phone_en = ?, gender_en = ?, password_en = ?, first_name_ar = ?, last_name_ar = ?, gender_ar = ? WHERE user_id = ?";
	qry.query(query, [first_name_en, last_name_en, email_en, phone_en, gender_en, password_en, first_name_ar, last_name_ar, gender_ar, user_id ], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.code });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Customer Not Found...!' });
        }

       	return res.status(200).json({ message: 'Customer Shipping Address Successfully...!' });
    });
};

exports.addCusWithDetail = (req, res) => {
	const { first_name_en, last_name_en, gender_en, email_en, phone_en, password_en, first_name_ar, last_name_ar,
		 gender_ar, state_or, state_or_ar, zip_code_or, zip_code_or_ar, street_add_or, street_add_or_ar, city_or, city_or_ar, country_or,
		 country_or_ar, zip_code_ship, zip_code_ship_ar, street_add_ship, street_add_ship_ar, state_ship, state_ship_ar, city_ship, 
		 city_ship_ar, country_ship, country_ship_ar } = req.body;

	try {
		const checkCustomerQuery = "SELECT * FROM customer WHERE email_en = " + JSON.stringify(email_en);
		qry.query(checkCustomerQuery, async (err, results) => {
			if (err) {
				return res.status(400).json({ message: "Database Error...!" });
			}
			if (results.length > 0) {
				return res.status(400).json({ message: "User already exists with the same email, Kindly Login with this email" });
			}
			const hashedPassword = await bcrypt.hash(password_en, 10);
			const insertCustomerQuery = "INSERT INTO customer (first_name_en, last_name_en, gender_en, email_en, phone_en, password_en, acknowledgment, subscribe, first_name_ar, last_name_ar, gender_ar, updated_by, state_or, state_or_ar, zip_code_or, zip_code_or_ar, street_add_or, street_add_or_ar, city_or, city_or_ar, country_or, country_or_ar, zip_code_ship, zip_code_ship_ar, street_add_ship, street_add_ship_ar, state_ship, state_ship_ar, city_ship, city_ship_ar, country_ship, country_ship_ar) VALUES ('" + first_name_en + "','" + last_name_en + "','" + gender_en + "','" + email_en + "','" + phone_en + "','" + hashedPassword + "', '1', '1', '" + first_name_ar + "','" + last_name_ar + "','" + gender_ar + "','" + first_name_en + "', '" + state_or + "', '" + state_or_ar + "', '" + zip_code_or + "', '" + zip_code_or_ar + "', '" + street_add_or + "', '" + street_add_or_ar + "', '" + city_or + "', '" + city_or_ar + "', '" + country_or + "', '" + country_or_ar + "', '" + zip_code_ship + "', '" + zip_code_ship_ar + "', '" + street_add_ship + "', '" + street_add_ship_ar + "', '" + state_ship + "', '" + state_ship_ar + "', '" + city_ship + "', '" + city_ship_ar + "', '" + country_ship + "', '" + country_ship_ar + "')";
			qry.query(insertCustomerQuery, async (cusErr, cusResult) => {
				if (cusErr) {
					return res.status(400).json({ message: cusErr });
				}

				const userId = cusResult.insertId;
				const insertUserQuery = "INSERT INTO users(username, usernameAR, name, phone, email, password, isactive, role, requestID, islocked, failattempt, createdby) VALUES ('" + first_name_en + "', '" + first_name_ar + "', '" + first_name_en + "', '" + phone_en + "', '" + email_en + "', '" + hashedPassword + "', 1, 'Customer (External)', " + cusResult.insertId + ", 0, 0, '" + first_name_en + "');";
				qry.query(insertUserQuery, async (userError, userRes) => {
					if (userError) {
						return res.status(400).json({ message: userRes });
					}
					const newUser = {
						id: userId,
						first_name_en,
						gender_en,
						email_en,
						phone_en,
						hashedPassword,
						role: 'Customer (External)',
					};
					return res.status(200).json({ message: "User registered successfully, please login ", newUser });
				});
			});
		});

	} catch (error) {
		return res.status(400).json({ message: "test 3" });
	}
};

exports.updateOrderStatus = (req, res) => {
	const {id, status} = req.body;
	if (!status) {
		return res.status(400).json({ message: 'Status Is Required...!' });
	  }
	
	  const query = "UPDATE orders SET order_status = ? WHERE orderId = ?";
	  qry.query(query, [status, id], (err, result) => {
		if (err) {
		  return res.status(500).json({ message: 'Database error...!' });
		}
	
		if (result.affectedRows === 0) {
		  return res.status(404).json({ message: 'Order not found...!' });
		}
	
		return res.status(200).json({ message: 'Order Status Updated Successfully...!' });
	  });
	}

	  exports.getUserEmail = (req, res) => {
		const { id } = req.body;
		const emailQry = "SELECT email FROM users WHERE requestID = ?";
		qry.query(emailQry, [id], (err, results) => {
		  if (err) {
			return res.status(500).json({ message: 'Internal Server Error...!' });
		  }
		  if (results.length === 0) {
			return res.status(404).json({ message: 'User Not Found...!' });
		  }
		  return res.status(200).json({ email: results[0]?.email });
		});
	};
