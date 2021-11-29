const {Router} = require('express')
const router = Router()
const User = require('../models/user')

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
    const user = await User.findById('61882fddb2c2e0c2be0eeb24');
    req.session.user = user;
    req.session.isAuthenticated = true;
    req.session.save(err => {
        if (err) {
            throw err
        } else {
            res.redirect('/')
        }
    })
})

module.exports = router