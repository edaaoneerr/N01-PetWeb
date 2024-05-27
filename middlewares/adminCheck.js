const connection = require("../server");

const adminCheck = (req, res, next) => {
    if (req.session.user && req.session.user.email) {
        const email = req.session.user.email;
        connection.query('SELECT isAdmin FROM users WHERE userEmail = ?', [email], (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ success: false, message: 'Database error occurred' });
            }

            if (results.length > 0 && results[0].isAdmin) {
                return next(); // User is an admin, proceed to the next middleware/route handler
            } else {
                return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
            }
        });
    } else {
        return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
    }
};

module.exports = adminCheck;
