const keys = require('../keys')

module.exports = function (email) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Account was created',
        html: `
            <h1>Welcome to my test NodeJS application</h1>
            <p>Your account was successfully created - ${email}</p>
            <hr />
            
            <a href="${keys.BASE_URL}">Click to redirect to Main Page</a>
        `
    }
}