const {Router} = require('express')
const router = Router()

router.get('/login', async function (req, res){
    res.render('auth/login', {
        title: 'Autorization',
        isLogin: true
    })
})

module.exports = router()