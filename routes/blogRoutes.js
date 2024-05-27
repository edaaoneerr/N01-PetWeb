const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// router.get('/', blogController.getSidebarData);

router.get('/', blogController.getAllArticles);
router.get('/category/:categoryId', blogController.getArticlesByCategory);
router.get('/article/:articleId', blogController.getArticle);
router.get('/:articleId/category/:categoryId', blogController.getArticleByCategory);

module.exports = router;
