const {Router} = require('express')
const Order = require('../models/order')
const router = Router()
var auth = require('../middleware/auth')

router.get('/', auth, async function (req, res) {
    try {
        const orders = await Order.find({
            'user.userId': req.user._id
        }).populate('user.userId')

        res.render('orders', {
            isOrder: true,
            title: 'Orders',
            orders: orders.map(c => {
                debugger;
                return {
                    ...c._doc,
                    price: c.courses.reduce((total, c) => {
                        return total += c.count * c.course.price
                    }, 0)
                }
            })
        })
    } catch (e) {
        console.log(e)
    }
})

router.post('/', auth, async function (req, res) {
    try {
        const user = await req.user
            .populate('cart.items.courseId')

        const courses = user.cart.items.map(i => ({
            count: i.count,
            course: {...i.courseId._doc}
        }))

        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user
            },
            courses: courses
        })

        await order.save()
        await req.user.clearCart()
    } catch (e) {
        console.log(e)
    }

    res.redirect('/orders')
})
module.exports = router