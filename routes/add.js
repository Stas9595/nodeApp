var express = require('express');
var Course = require('../models/course');
var router = express.Router();
var auth = require('../middleware/auth')

/* GET home page. */
router.get('/', auth, function(req, res, next) {
    res.render('add', {
        title: 'Add Course',
        isAdd: true
    });
});

router.post('/', auth, async function (req, res) {
    //var course = new Course(req.body.name, req.body.price, req.body.image)
    const course = new Course({
        title: req.body.name,
        price: req.body.price,
        img: req.body.image,
        userId: req.user._id
    })

    try {
        await course.save();
        res.redirect('/courses');
    } catch (e) {
        console.log(e)
    }
});

module.exports = router;
