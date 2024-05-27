const bcrypt = require('bcrypt');
const connection = require("../server")
const { encrypt, decrypt } = require('../public/js/global');
require('dotenv').config();  // This should be at the very top of your main file

exports.getAddArticle = (req, res) => {
    res.render('pages/admin/add-article', { authInfo: req.authInfo });
};

// exports.postAddArticle = (req, res) => {
//     const { title, content } = req.body;
//     const query = 'INSERT INTO articles (title, content) VALUES (?, ?)';
//     connection.query(query, [title, content], (err, result) => {
//         if (err) {
//             console.error("Database error:", err);
//             return res.status(500).json({ success: false, message: 'Database error occurred' });
//         }
//         res.status(201).json({ success: true, message: 'Article added successfully' });
//     });
// };

exports.getInfo = (req, res) => {
    const queries = [
        'SELECT COUNT(*) AS articleCount FROM articles WHERE isActive = TRUE',
        'SELECT COUNT(*) AS categoryCount FROM categories WHERE isActive = TRUE',
        'SELECT COUNT(*) AS adminCount FROM users WHERE isAdmin = TRUE',
        'SELECT COUNT(*) AS productCount FROM products',
        'SELECT * FROM articles' // Fetch all articles
    ];

    const promises = queries.map((query, index) => {
        return new Promise((resolve, reject) => {
            connection.query(query, (err, results) => {
                if (err) return reject(err);
                if (index < 4) {
                    resolve(results[0]); // Resolve with the first result for count queries
                } else {
                    resolve(results); // Resolve with all results for articles query
                }
            });
        });
    });

    Promise.all(promises)
        .then(([articleCount, categoryCount, adminCount, productCount, articles]) => {
            res.render('pages/admin/admin', {
                authInfo: req.session.authInfo,
                articleCount: articleCount.articleCount,
                categoryCount: categoryCount.categoryCount,
                adminCount: adminCount.adminCount,
                productCount: productCount.productCount,
                articles: articles, // Ensure articles is an array
                csrfToken: req.csrfToken()

            });
        })
        .catch(err => {
            console.error('Database error:', err);
            res.status(500).json({ success: false, message: 'Database error occurred' });
        });
}

exports.getArticles = (req, res) => {
    connection.query('SELECT * FROM articles WHERE isActive = 1', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error occurred' });
        }
        res.json(results);
    });
};

exports.getCategories = (req, res) => {
    connection.query('SELECT * FROM categories WHERE isActive = 1', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error occurred' });
        }
        res.json(results);
    });
};

exports.getAdmins = (req, res) => {
    connection.query('SELECT * FROM users WHERE isAdmin = 1', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error occurred' });
        }
        res.json(results);
    });
};

exports.getProducts = (req, res) => {
    connection.query('SELECT * FROM products', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error occurred' });
        }
        res.json(results);
    });
};

exports.addCategory = (req, res) => {
    const { categoryName } = req.body;
    console.log("Add category, category name: ", categoryName)
    const query = 'INSERT INTO categories (categoryName) VALUES (?)';
    connection.query(query, [categoryName], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error occurred' });
        }
    
        res.status(201).json({ success: true, message: 'Category added successfully', id: results.insertId });
    });
};

exports.addProduct = (req, res) => {
    const { productBrand, productName, productPrice, productWeight, productSize, productCategory, productImagePath, productStockCode, productBarcode, productStarCount, productReviewCount, productDiscount, productInstallmentPrice, isFreeShipping } = req.body;
    const query = `INSERT INTO products (productBrand, productName, productPrice, productWeight, productSize, productCategory, productImagePath, productStockCode, productBarcode, productStarCount, productReviewCount, productDiscount, productInstallmentPrice, isFreeShipping) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?, 0)`;
    connection.query(query, [productBrand, productName, productPrice, productWeight, productSize, productCategory, productImagePath, productStockCode, productBarcode, productStarCount, productReviewCount, productDiscount, productInstallmentPrice, isFreeShipping], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error occurred' });
        }
        res.status(201).json({ success: true, message: 'Product added successfully', id: results.insertId });
    });
};

exports.addArticle = (req, res) => {
    const { articleTitle, articleDescription, articleContent, articleDate, articleCategory, articleDistricts, articleImagePath } = req.body;
    const query = `INSERT INTO articles (articleTitle, articleDescription, articleContent, articleDate, articleCategory, articleDistricts, articleImagePath) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    connection.query(query, [articleTitle, articleDescription, articleContent, articleDate, articleCategory, articleDistricts, articleImagePath], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error occurred' });
        }
        res.status(201).json({ success: true, message: 'Article added successfully', id: results.insertId });
    });
};

exports.addUser = (req, res) => {
    const { userName, userLastname, userEmail, userPassword } = req.body;

    const encryptedPassword = encrypt(userPassword)

    const query = `INSERT INTO users (userName, userLastname, userEmail, userPassword, isAdmin) VALUES (?, ?, ?, ?, 1)`;
    connection.query(query, [userName, userLastname, userEmail, encryptedPassword], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error occurred' });
        }
        res.status(201).json({ success: true, message: 'User added successfully', id: results.insertId });
    });
};

exports.deleteCategory = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM categories WHERE categoryId = ?';
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error occurred' });
        }
        res.status(200).json({ success: true, message: 'Category deleted successfully' });
    });
};

exports.deleteProduct = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM products WHERE productId = ?';
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error occurred' });
        }
        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    });
};

exports.deleteArticle = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM articles WHERE articleId = ?';
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error occurred' });
        }
        res.status(200).json({ success: true, message: 'Article deleted successfully' });
    });
};

exports.deleteUser = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM users WHERE userId = ?';
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error occurred' });
        }
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    });
};

