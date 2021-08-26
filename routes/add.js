var express = require('express');
var Course = require('../models/course')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('add', {
        title: 'Add Course',
        isAdd: true
    });
});

router.post('/', function (req, res) {
    debugger;
    console.log(req.body);
    var course = new Course(req.body.name, req.body.price, req.body.image)
    course.save();

    res.redirect('/courses');
    console.log(req.name);
});

module.exports = router;
