const bcrypt = require('bcrypt');
const connection = require("../server")
const { encrypt, decrypt } = require('../public/js/global');
require('dotenv').config();  // This should be at the very top of your main file

// Get register page
exports.getRegister = (req, res) => {
    res.json({ success: true, message: 'Register page' });
};

exports.postLogin = async (req, res) => {

    console.log(req.body)
    const { email, password, rememberMe } = req.body;

    console.log(email, password, rememberMe)

    connection.query('SELECT * FROM users WHERE userEmail = ?', [email], async (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ success: false, message: 'Database error occurred' });
        }

        const user = results[0];
        if (!user) {
            return res.status(404).json({ success: false, message: 'Email is incorrect' });
        }

        const match = await bcrypt.compare(password, user.userPassword);
        if (match) {
            req.session.isAuth = true;
            req.session.user = { email };

            if (rememberMe === true){ 
                console.log("Remember me is true")
                const encryptedEmail = encrypt(email);
                console.log("Encrypted email: ", encryptedEmail)
                const encryptedPassword = encrypt(password);
                console.log("Encrypted password: ", encryptedPassword)

                res.cookie('rememberEmail', encrypt(req.body.email), { httpOnly: true, secure: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
                res.cookie('rememberPassword', encrypt(req.body.password), { httpOnly: true, secure: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
            }
            else{
                console.log("Clearing cookies")
                res.clearCookie("rememberEmail");
                res.clearCookie("rememberPassword"); 
            }

            connection.query('UPDATE users SET isOnline = 1 WHERE userEmail = ?', [email], (err, result) => {
                if (err) {
                    console.error("Database error for setting online:", err.message);
                    return res.status(500).json({ success: false, message: 'Database error occurred' });
                }});
            return res.status(200).json({ success: true, message: "Login successful!" });

        } else {
            return res.status(401).json({ success: false, message: 'Password is incorrect' });
        }
    });
};

exports.autoLogin = (req, res) => {
    const { autoLogin } = req.cookies;
    if (autoLogin) {
        try {
            const decryptedToken = decrypt(autoLogin);
            const [email, password] = decryptedToken.split(':');

            // Simulate re-validation of credentials
            const user = { email: 'user@example.com', passwordHash: bcrypt.hashSync('your-password', 10) };
            if (email === user.email && bcrypt.compareSync(password, user.passwordHash)) {
                res.json({ success: true, message: "Auto-login successful!" });
            } else {
                res.status(401).json({ success: false, message: "Failed to auto-login." });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: "Error decrypting the token." });
        }
    } else {
        res.status(401).json({ success: false, message: "No auto-login data found." });
    }
};
exports.postRegister = async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    console.log("Register Request Data:", req.body);

    if (!email || !password || !firstname || !lastname) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = 'INSERT INTO users (userName, userLastname, userEmail, userPassword) VALUES (?, ?, ?, ?)';
        const values = [firstname, lastname, email, hashedPassword];

        connection.query(query, values, (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    console.log("Duplicate email error, sending 409 response");
                    return res.status(409).json({ success: false, message: 'Email already registered. Please log in instead.' });
                }
                console.error("Database error:", err);
                return res.status(500).json({ success: false, message: 'Registration failed due to database error' });
            }
            
            console.log("User Registered Successfully");
            return res.status(201).json({ success: true, message: 'User registered successfully' });
        });
    } catch (err) {
        console.error("Error during registration process:", err);
        return res.status(500).json({ success: false, message: 'Registration failed due to server error' });
    }
};

// exports.logout = (req, res) => {
//     const userEmail = req.session.user ? req.session.user.email : null;

//     req.session.destroy(err => {
//         if (err) {
//             console.log("Logout Error:", err);
//             return res.json({ success: false, message: 'Logout failed' });
//         }

//         if (userEmail) {
//             connection.query('UPDATE users SET isOnline = 0 WHERE userEmail = ?', [userEmail], (err, result) => {
//                 if (err) {
//                     console.error("Database error for setting online:", err.message);
//                     return res.status(500).json({ success: false, message: 'Database error occurred' });
//                 }

//                 res.clearCookie('rememberMe');
//                 res.clearCookie('rememberEmail');
//                 res.clearCookie('rememberPassword');
//                 console.log("User Logged Out Successfully");
//                 return res.status(201).json({ success: true, message: 'User logged out successfully' });
//             });
//         } else {
//             res.clearCookie('rememberMe');
//             res.clearCookie('rememberEmail');
//             res.clearCookie('rememberPassword');
//             console.log("User Logged Out Successfully");
//             return res.status(201).json({ success: true, message: 'User logged out successfully' });
//         }
//     });
// };

exports.logout = (req, res) => {
    const userEmail = req.session.user ? req.session.user.email : null;

    req.session.destroy(err => {
        if (err) {
            console.log("Logout Error:", err);
            return res.json({ success: false, message: 'Logout failed' });
        }

        if (userEmail) {
            connection.query('UPDATE users SET isOnline = 0 WHERE userEmail = ?', [userEmail], (err, result) => {
                if (err) {
                    console.error("Database error for setting online:", err.message);
                    return res.status(500).json({ success: false, message: 'Database error occurred' });
                }
                console.log("User Logged Out Successfully");
                return res.status(201).json({ success: true, message: 'User logged out successfully' });
            });
        } else { 
            console.log("User Logged Out Successfully");
            return res.status(201).json({ success: true, message: 'User logged out successfully' });
        }
    });
};



