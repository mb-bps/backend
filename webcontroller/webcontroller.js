const db = require('../config/db.js');


exports.findAllHead = (req, res) => {
	const sql = "SELECT * from head";
    db.query(sql, (err, data) => {
        if(err) return res.json("Error");
        return res.json(data);
    });
}

exports.findAllFooter = (req, res) => {
        const sql = "SELECT * from footer";
        db.query(sql, (err, data) => {
            if(err) return res.json("Error");
            return res.json(data);
        })
}

exports.findAllHome = (req, res) => {
	const sql = "SELECT * from home";
    db.query(sql, (err, data) => {
        if(err) return res.json("Error");
        return res.json(data);
    });
}

exports.findAllHomeImages = (req, res) => {
	const sql = "SELECT * from home_images";
    db.query(sql, (err, data) => {
        if(err) return res.json("Error");
        return res.json(data);
    });
}

exports.findAllTestimonials = (req, res) => {
	const sql = "SELECT * from testimonials";
    db.query(sql, (err, data) => {
        if(err) return res.json("Error");
        return res.json(data);
    });
}

exports.findAllNews = (req, res) => {
	const sql = "SELECT * from news";
    db.query(sql, (err, data) => {
        if(err) return res.json("Error");
        return res.json(data);
    });
}

exports.findAllPartners = (req, res) => {
	const sql = "SELECT * from partners";
    db.query(sql, (err, data) => {
        if(err) return res.json("Error");
        return res.json(data);
    });
}

exports.updAboutUs = (req, res) => {
    const sql = "UPDATE home SET en = (CASE id WHEN 1 THEN 'English32' WHEN 2 THEN 'English76' END) WHERE id IN (1,2);";
    const sql1 = "UPDATE home SET ar = (CASE id WHEN 1 THEN 'Arabic12' WHEN 2 THEN 'Arabic1234' END) WHERE id IN (1,2);";
    db.query(sql, (err, data) => {
        if(err) return res.json("Error");
    });
    db.query(sql1, (err, data) => {
        if(err) return res.json("Error");
        return res.json(data);
    });
}