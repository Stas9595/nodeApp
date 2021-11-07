var express = require('express');
const Course = require('../models/course')
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
    const courses = await Course.find()
        .populate('userId', 'email name')
    console.log(courses)
    res.render('courses', {
        title: 'Courses',
        isCourses: true,
        courses
    });
    const t = 'test';
});

router.get('/:id/edit', async function (req, res) {
    if (!req.query.allow) {
        return res.redirect('/')
    }
    const course = await Course.findById(req.params.id)
    res.render('course-edit', {
        title: `Edit ${course.title}`,
        course
    })
});

router.post('/edit', async (req, res) => {
    const {id} = req.body
    delete req.body.id
    await Course.findByIdAndUpdate(id, req.body)
    console.log(id, JSON.stringify(req.body))
    res.redirect('/courses')
})

router.get('/:id', async function (req, res) {
    const course = await Course.findById(req.params.id)
    debugger;
    res.render('course', {
        layout: 'empty',
        title: `Course ${course.title}`,
        course
    })
})

router.post('/remove', async function (req, res){
    try {
        await Course.deleteOne({_id: req.body.id})
        res.redirect('/courses')
    } catch (e) {
        console.log(e)
    }
})
module.exports = router;
