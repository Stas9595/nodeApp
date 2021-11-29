var express = require('express');
const Course = require('../models/course')
var router = express.Router();
var auth = require('../middleware/auth')

/* GET home page. */
router.get('/', async function(req, res, next) {
    const courses = await Course.find()
        .populate('userId', 'email name')

    res.render('courses', {
        title: 'Courses',
        isCourses: true,
        courses
    });
    const t = 'test';
});

router.get('/:id/edit', auth, async function (req, res) {
    if (!req.query.allow) {
        return res.redirect('/')
    }
    const course = await Course.findById(req.params.id)
    res.render('course-edit', {
        title: `Edit ${course.title}`,
        course
    })
});

router.post('/edit', auth, async (req, res) => {
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

router.post('/remove', auth, async function (req, res){
    try {
        await Course.deleteOne({_id: req.body.id})
        res.redirect('/courses')
    } catch (e) {
        console.log(e)
    }
})
module.exports = router;
