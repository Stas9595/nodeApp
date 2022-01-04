const {Router, request} = require('express')
const router = Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const keys = require('../keys')
const regEmail = require('../emails/registration')
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(keys.SENDGRID_API_KEY)

router.get('/login', async function (req, res){
    res.render('auth/login', {
        title: 'Autorization',
        isLogin: true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError')
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
                req.flash('loginError', 'Please check your credentials: login or password')
                res.redirect('/auth/login#login')
            }

        } else {
            req.flash('loginError', 'Please check your credentials: login or password')
            res.redirect('/auth/login#login')
        }
    } catch (e) {
        console.log(e)
    }
})

router.get('/logout', async function (req, res){
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    })
})

router.post('/register', async (req, res) => {
    try {
        const {email, password, repeat, name} = req.body
        const candidate = await User.findOne({email})

        if (candidate) {
            req.flash('registerError', 'User with current email already exists')
            res.redirect('/auth/login#register')
        } else {
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({
                email, name, password: hashPassword, cart : {items: []}
            })
            await user.save()
            res.redirect('/auth/login#login')
            await sgMail.send(regEmail(email))
        }

    } catch (e) {
        console.log(e.toString());
    }
})

module.exports = router