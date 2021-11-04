var express = require('express');
var router = express.Router();
var Card = require('../models/card');
var Course = require('../models/course');

router.post('/add', async (req, res) => {
    const course = await Course.getByID(req.body.id);
    await Card.add(course);
    res.redirect('/card');
});

router.delete('/remove/:id', async function (req, res) {
    const card = await Card.remove(req.params.id)
    res.status(200).json(card)
})

router.get('/', async (req, res) => {
    const card = await Card.fetch();
    res.render('card', {
        title: 'Basket',
        isCard: true,
        courses: card.courses,
        price: card.price
    });
});

module.exports = router