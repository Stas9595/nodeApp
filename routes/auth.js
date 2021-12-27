const {Router, request} = require('express')
const router = Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')

router.get('/login', async function (req, res){
    res.render('auth/login', {
        title: 'Autorization',
        isLogin: true
    })
})

router.get('/logout', async function (req, res){
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    })
})

router.post('/login', async function (req, res) {
    try {
        const {email, password} = req.body

        const candidate = await User.findOne({email})

        if (candidate) {

            const areSame = await bcrypt.compare(password, candidate.password)

            if (areSame) {
                req.session.user = candidate;
                req.session.isAuthenticated = true;
                req.session.save(err => {
                    if (err) {
                        throw err
                    } else {
                        res.redirect('/')
                    }
                })
            } else {
                res.redirect('/auth/login#login')
            }

        } else {
            res.redirect('/auth/login#login')
        }
    } catch (e) {
        console.log(e)
    }
})

router.post('/register', async (req, res) => {
    try {
        const {email, password, repeat, name} = req.body
        const candidate = await User.findOne({email})

        if (candidate) {
            res.redirect('/auth/login#register')
        } else {
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({
                email, name, password: hashPassword, cart : {items: []}
            })
            await user.save()
            res.redirect('/auth/login#login')
        }

    } catch (e) {

    }
})

module.exports = router