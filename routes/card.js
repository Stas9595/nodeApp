var express = require('express');
var router = express.Router();
var Course = require('../models/course');

function mapCartItems(cart) {
    return cart.items.map(c => ({
        ...c._doc.courseId._doc,
        id: c._doc.courseId.id,
        count: c._doc.count
    }))
}

function computePrice(courses) {
    return courses.reduce((total, course) => {
        return total += course.price * course.count
    }, 0)
}

router.post('/add', async (req, res) => {
    const course = await Course.findById(req.body.id);
    await req.user.addToCart(course)
    res.redirect('/card');
});

router.delete('/remove/:id', async function (req, res) {
    await req.user.removeFromCart(req.params.id)
    const user = await req.user.populate('cart.items.courseId')

    const courses = mapCartItems(user.cart)
    const cart = {
        courses, price: computePrice(courses)
    }
    res.status(200).json(cart)
})

router.get('/', async (req, res) => {
    const user = await req.user.populate({
        path: 'cart.items.courseId'
    })
    const courses = mapCartItems(user.cart)

    res.render('card', {
        title: 'Basket',
        isCard: true,
        courses: courses,
        price: computePrice(courses)
    });
});

module.exports = router