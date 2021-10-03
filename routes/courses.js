var express = require('express');
const Course = require('../models/course')
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
    const courses = await Course.getAll()
    res.render('courses', {
        title: 'Courses',
        isCourses: true,
        courses
    });
});

module.exports = router;
