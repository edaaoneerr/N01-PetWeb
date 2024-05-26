// const { decrypt } = require('../public/js/global');

// const decryptCookies = (req, res, next) => {
//     if (req.session.user && req.cookies.rememberEmail && req.cookies.rememberPassword) {
//         try {
//             req.decryptedEmail = decrypt(req.cookies.rememberEmail);
//             req.decryptedPassword = decrypt(req.cookies.rememberPassword);
//         } catch (error) {
//             console.error("Error decrypting cookies:", error);
//         }
//     }
//     next();
// };
// module.exports = decryptCookies;
// middlewares/decryptCookies.js

const { decrypt } = require('../public/js/global');

module.exports = (req, res, next) => {
    console.log("User", req.session.user)
    let email = '';
    let password = '';
    if (req.session.user && req.cookies.rememberEmail && req.cookies.rememberPassword) {
        if (req.cookies.rememberEmail && req.cookies.rememberPassword) {
            try {
                email = decrypt(req.cookies.rememberEmail);
                password = decrypt(req.cookies.rememberPassword);
            } catch (error) {
                console.error("Error decrypting cookies:", error);
            }
        } 
    } 
    req.session.authInfo = { email, password };
    req.authInfo = req.session.authInfo;
    next();
};
