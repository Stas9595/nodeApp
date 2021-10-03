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

router.get('/:id/edit', async function (req, res) {
    if (!req.query.allow) {
        return res.redirect('/')
    }
    const course = await Course.getByID(req.params.id)
    res.render('course-edit', {
        title: `Edit ${course.title}`,
        course
    })
});

router.post('/edit', async (req, res) => {
    await Course.update(req.body)
    res.redirect('/courses')
})

router.get('/:id', async function (req, res) {
    const course = await Course.getByID(req.params.id)
    res.render('course', {
        layout: 'empty',
        title: `Course ${course.title}`,
        course
    })
})
module.exports = router;
