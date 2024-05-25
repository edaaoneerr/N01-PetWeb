const { decrypt } = require('../public/js/global');

const decryptCookies = (req, res, next) => {
    if (req.session.user && req.cookies.rememberEmail && req.cookies.rememberPassword) {
        try {
            req.decryptedEmail = decrypt(req.cookies.rememberEmail);
            req.decryptedPassword = decrypt(req.cookies.rememberPassword);
        } catch (error) {
            console.error("Error decrypting cookies:", error);
        }
    }
    next();
};

module.exports = decryptCookies;
