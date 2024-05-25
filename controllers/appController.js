const connection = require("../server")
const { encrypt, decrypt } = require('../public/js/global');
require('dotenv').config();  // This should be at the very top of your main file

exports.incrementVisitorCount = (req, res) => {
    const queryIncrement = 'UPDATE visitor_counter SET visitorCount = visitorCount + 1 WHERE visitorId = 1';
    connection.query(queryIncrement, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Server error');
        }
        res.send('Visitor count incremented');
    });
};

exports.getUserCounts = (req, res) => {
    const queryOnline = 'SELECT COUNT(*) as onlineCount FROM users WHERE isOnline = 1';
    const queryVisitors = 'SELECT visitorCount FROM visitor_counter'; // Adjust according to your table structure

    connection.query(queryOnline, (err, onlineResults) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Server error');
        }
        connection.query(queryVisitors, (err, visitorResults) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Server error');
            }
            res.json({
                onlineCount: onlineResults[0].onlineCount,
                visitorCount: visitorResults[0].visitorCount
            });
        });
    });
}

exports.updateUserStatus = (req, res) => {
    const { userId, isOnline } = req.body;
    const query = 'UPDATE users SET isOnline = ? WHERE userId = ?';

    connection.query(query, [isOnline, userId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Server error');
        }
        res.send('Status updated');
    });
}

exports.getDecryptedCredentials = (req, res) => {
    let email = '';
    let password = '';

    if (req.cookies.rememberEmail && req.cookies.rememberPassword) {
        try {
            email = decrypt(req.cookies.rememberEmail);
            password = decrypt(req.cookies.rememberPassword);
        } catch (error) {
            console.error("Error decrypting cookies:", error);
        }
    }

    res.json({ email, password });
}