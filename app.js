const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const appRoutes = require('./routes/appRoutes');
const productController = require("./controllers/productController")
const connection = require("./server")
const decryptCookies = require("./middlewares/decryptCookies")
require('dotenv').config();  // This should be at the very top of your main file


// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.json());  // This must be placed before any routes that will handle JSON.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: '0274aa0f-76e5-4095-8947-38b206597703',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 } // 1 minute for demo purposes
}));

// Disable caching
app.use(express.json());
// Set up the routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/', appRoutes)


app.get('/', decryptCookies, (req, res) => {
    let email = req.decryptedEmail || '';
    let password = req.decryptedPassword || '';

    connection.query('SELECT * FROM products', (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ success: false, message: 'Database error occurred' });
        }

        res.render("pages/index", {
            pageTitle: "Pet Shop",
            authInfo: { email, password },
            products: results
        });
    });
});


app.get('/product-detail', productController.getProduct);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
