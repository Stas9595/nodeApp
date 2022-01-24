const keys = require("../keys");
module.exports = function (email, token) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Password reset',
        html: `
            <h1>Forgot Password?</h1>
            <p>If not then ignore this email</p>
            <p>If yes - click on the link below</p>
            <hr />
            <p><a href="${keys.BASE_URL}/auth/password/${token}">Reset Password</a></p>
        `
    }
}