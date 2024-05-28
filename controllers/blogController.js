const connection = require("../server");

exports.getAllArticles = (req, res) => {
    connection.query('SELECT * FROM articles WHERE articleCategory = 1', (err, articles) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ success: false, message: 'Database error occurred' });
        }
        const article = articles[0];

        connection.query('SELECT * FROM articles WHERE articleCategory = 1 ORDER BY createdAt DESC LIMIT 5', (err, recentArticles) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ success: false, message: 'Database error occurred' });
            }

            connection.query('SELECT * FROM categories WHERE isActive = 1', (err, categories) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({ success: false, message: 'Database error occurred' });
                }

                res.render('pages/blog', {
                    authInfo: req.session.authInfo,
                    article,
                    articles,
                    recentArticles,
                    categories,
                    csrfToken: req.csrfToken()
                });
            });
        });
    });
};

exports.getArticleByCategory = (req, res) => {
    const { articleId, categoryId } = req.params;

    connection.query('SELECT * FROM articles WHERE articleId = ? AND isActive = TRUE', [articleId], (err, articles) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ success: false, message: 'Database error occurred' });
        }
        const article = articles[0];

        connection.query('SELECT * FROM clinics WHERE articleId = ? AND isActive = TRUE', [articleId], (err, clinics) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ success: false, message: 'Database error occurred' });
            }

            connection.query('SELECT * FROM articles WHERE articleCategory = ? AND isActive = TRUE ORDER BY createdAt DESC LIMIT 5', [categoryId], (err, recentArticles) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({ success: false, message: 'Database error occurred' });
                }

                connection.query('SELECT * FROM categories WHERE isActive = 1', (err, categories) => {
                    if (err) {
                        console.error("Database error:", err);
                        return res.status(500).json({ success: false, message: 'Database error occurred' });
                    }

                    res.render('pages/article', {
                        authInfo: req.session.authInfo,
                        article,
                        clinics,
                        recentArticles,
                        categories,
                        csrfToken: req.csrfToken()
                    });
                });
            });
        });
    });
};

exports.getArticlesByCategory = (req, res) => {
    const { categoryId } = req.params;

    connection.query('SELECT * FROM articles WHERE articleCategory = ? AND isActive = TRUE', [categoryId], (err, articles) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ success: false, message: 'Database error occurred' });
        }
        const article = articles[0];

        connection.query('SELECT * FROM clinics WHERE isActive = TRUE', (err, clinics) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ success: false, message: 'Database error occurred' });
            }

            connection.query('SELECT * FROM articles WHERE articleCategory = ? AND isActive = TRUE ORDER BY createdAt DESC LIMIT 5', [categoryId], (err, recentArticles) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({ success: false, message: 'Database error occurred' });
                }

                connection.query('SELECT * FROM categories WHERE isActive = 1', (err, categories) => {
                    if (err) {
                        console.error("Database error:", err);
                        return res.status(500).json({ success: false, message: 'Database error occurred' });
                    }

                    res.render('pages/blog', {
                        authInfo: req.session.authInfo,
                        article,
                        articles,
                        clinics,
                        recentArticles,
                        categories,
                        csrfToken: req.csrfToken()
                    });
                });
            });
        });
    });
};

exports.getArticle = (req, res) => {
    const { articleId } = req.params;

    connection.query('SELECT * FROM articles WHERE articleId = ? AND isActive = TRUE', [articleId], (err, articles) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ success: false, message: 'Database error occurred' });
        }
        const article = articles[0];

        connection.query('SELECT * FROM clinics WHERE articleId = ? AND isActive = TRUE', [articleId], (err, clinics) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ success: false, message: 'Database error occurred' });
            }

            const articleCategory = article.articleCategory;

            connection.query('SELECT * FROM articles WHERE articleCategory = ? AND isActive = TRUE ORDER BY createdAt DESC LIMIT 5', [articleCategory], (err, recentArticles) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({ success: false, message: 'Database error occurred' });
                }

                connection.query('SELECT * FROM categories WHERE isActive = 1', (err, categories) => {
                    if (err) {
                        console.error("Database error:", err);
                        return res.status(500).json({ success: false, message: 'Database error occurred' });
                    }

                    res.render('pages/article', {
                        authInfo: req.session.authInfo,
                        article,
                        clinics,
                        recentArticles,
                        categories,
                        csrfToken: req.csrfToken()
                    });
                });
            });
        });
    });
};

exports.getArticleBySlug = (req, res) => {
    const { slug } = req.params;
    
    connection.query('SELECT * FROM articles WHERE slug = ? AND isActive = TRUE', [slug], (err, articles) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error occurred' });
        }
        console.log("Articles: ", articles)
        const article = articles[0];
      
        connection.query('SELECT * FROM clinics WHERE articleId = ? AND isActive = TRUE', [article.articleId], (err, clinics) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ success: false, message: 'Database error occurred' });
            }

            connection.query('SELECT * FROM articles WHERE articleCategory = ? AND isActive = TRUE ORDER BY createdAt DESC LIMIT 5', [article.articleCategory], (err, recentArticles) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ success: false, message: 'Database error occurred' });
                }

                connection.query('SELECT * FROM categories WHERE isActive = 1', (err, categories) => {
                    if (err) {
                        console.error('Database error:', err);
                        return res.status(500).json({ success: false, message: 'Database error occurred' });
                    }

                    res.render('pages/article', {
                        authInfo: req.session.authInfo,
                        article,
                        clinics,
                        recentArticles,
                        categories,
                        csrfToken: req.csrfToken()
                    });
                });
            });
        });
    });
};

exports.getArticlesByCategorySlug = (req, res) => {
    const { slug } = req.params;

    connection.query('SELECT * FROM categories WHERE slug = ?', [slug], (err, categories) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error occurred' });
        }
        if (categories.length === 0) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        const category = categories[0];

        connection.query('SELECT * FROM articles WHERE articleCategory = ? AND isActive = TRUE', [category.categoryId], (err, articles) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ success: false, message: 'Database error occurred' });
            }

            connection.query('SELECT * FROM clinics WHERE isActive = TRUE', (err, clinics) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({ success: false, message: 'Database error occurred' });
                }

                connection.query('SELECT * FROM articles WHERE articleCategory = ? AND isActive = TRUE ORDER BY createdAt DESC LIMIT 5', [category.categoryId], (err, recentArticles) => {
                    if (err) {
                        console.error("Database error:", err);
                        return res.status(500).json({ success: false, message: 'Database error occurred' });
                    }

                    connection.query('SELECT * FROM categories WHERE isActive = 1', (err, categories) => {
                        if (err) {
                            console.error("Database error:", err);
                            return res.status(500).json({ success: false, message: 'Database error occurred' });
                        }

                        res.render('pages/blog', {
                            authInfo: req.session.authInfo,
                            articles,
                            clinics,
                            recentArticles,
                            categories,
                            csrfToken: req.csrfToken()
                        });
                    });
                });
            });
        });
    });
};
