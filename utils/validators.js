const {body} = require('express-validator')
const User = require('../models/user')

exports.registerValidators = [
    body('email')
        .isEmail().withMessage('Please enter correct email address')
        .custom(async (value, {req}) => {
            try {
                const user = await User.findOne({
                    email: value
                })

                if (user) {
                    return Promise.reject('User with current email already exists')
                }

            } catch (e) {
                console.log(e)
            }
    }),
    body('password', 'Password should contain more then 5 symbols')
        .isLength({min: 6, max: 26})
        .isAlphanumeric(),
    body('confirm')
        .custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match')
        }
        return true
        }),
    body('name')
        .isLength({min: 3})
        .withMessage('Name should contain more then 2 symbols')
]