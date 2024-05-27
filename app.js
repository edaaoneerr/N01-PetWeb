const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./sequelize'); // Import Sequelize instance
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const appRoutes = require('./routes/appRoutes');
const adminRoutes = require('./routes/adminRoutes');
const blogRoutes = require('./routes/blogRoutes');
const productController = require("./controllers/productController");
const connection = require("./server");
const decryptCookies = require("./middlewares/decryptCookies");
const csurf = require('csurf');

require('dotenv').config();

const app = express();

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.json()); // This must be placed before any routes that will handle JSON.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const csrfProtection = csurf({ cookie: true });
app.use(csrfProtection);

// Session Store
const sessionStore = new SequelizeStore({
    db: sequelize,
});

app.use(session({
    secret: '0274aa0f-76e5-4095-8947-38b206597703',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

// Initialize Sequelize Store
sessionStore.sync();

// Disable caching
app.use(express.json());
app.use(decryptCookies);

// Set up the routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/admin', adminRoutes);
app.use('/blog', blogRoutes);
app.use('/', appRoutes);

app.get('/', (req, res) => {
    connection.query('SELECT * FROM products', (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ success: false, message: 'Database error occurred' });
        }

        res.render("pages/index", {
            pageTitle: "Pet Shop",
            authInfo: req.authInfo,
            products: results,
            csrfToken: req.csrfToken()
        });
    });
});

app.get('/product-detail', productController.getProduct);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
