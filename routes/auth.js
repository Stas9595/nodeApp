const {Router, request} = require('express')
const router = Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const keys = require('../keys')
const regEmail = require('../emails/registration')
const sgMail = require('@sendgrid/mail')
const crypto = require('crypto')
const resetEmail = require('../emails/reset')
const {body, validationResult} = require('express-validator')
const {registerValidators} = require('../utils/validators')

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

router.post('/register', registerValidators, async (req, res) => {
    try {

        const {email, password, name} = req.body

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('registerError', errors.array()[0].msg)
            return res.status(422).redirect('/auth/login#register')
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const user = new User({
            email, name, password: hashPassword, cart : {items: []}
        })
        await user.save()
        res.redirect('/auth/login#login')
        await sgMail.send(regEmail(email))

    } catch (e) {
        console.log(e.toString());
    }
})

router.get('/reset', function (req, res) {
    res.render('auth/reset', {
        title: 'Forgot Password?',
        error: req.flash('error')
    })
})

router.get('/password/:token', async function (req, res) {
    
    if (!req.params.token) {
        return res.redirect('/auth/login')
    }
    
    try {
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExp: {$gt: Date.now()}
        })

        if (!user) {
            return res.redirect('/auth/login')
        } else {
            res.render('auth/password', {
                title: 'Reset Password',
                error: req.flash('error'),
                userId: user._id.toString(),
                token: req.params.token
            })
        }
    } catch (e) {
      console.log(e)
    }
})

router.post('/reset',function (req, res) {
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                req.flash('error', 'Something went wrong, try again')
                return res.redirect('/auth/reset')
            }

            const token = buffer.toString('hex')
            const candidate = await User.findOne({email: req.body.email})

            if (candidate)
            {
                candidate.resetToken = token
                candidate.resetTokenExp = Date.now() + 60 * 60 * 1000
                await candidate.save()
                await sgMail.send(resetEmail(candidate.email, token))
                res.redirect('/auth/login')
            }
            else
            {
                req.flash('error', 'User with this email doesn`t exist')
                res.redirect('/auth/reset')
            }

        })
    } catch (e) {
        console.log(e.toString());
    }
})

router.post('/password', async function (req, res) {
    try {
        const user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExp: {$gt: Date.now()}
        })

        if (user) {
            user.password = await bcrypt.hash(req.body.password, 10)
            user.resetToken = undefined
            user.resetTokenExp = undefined
            await user.save()
            res.redirect('/auth/login')
        } else {
            req.flash('loginError', 'Token expired')
            res.redirect('/auth/login')
        }

    } catch (e) {
        console.log(e)
    }
})

module.exports = router