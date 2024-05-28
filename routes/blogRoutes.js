const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

router.get('/', blogController.getAllArticles);
router.get('/category/:categoryId', blogController.getArticlesByCategory);
router.get('/article/:articleId', blogController.getArticle);
router.get('/:articleId/category/:categoryId', blogController.getArticleByCategory);

router.get('/category/slug/:slug', blogController.getArticlesByCategorySlug);
//http://localhost:3000/blog/category/slug/veterinerler
//http://localhost:3000/blog/category/slug/evcil-hayvanlar

router.get('/article/slug/:slug', blogController.getArticleBySlug);
//http://localhost:3000/blog/article/slug/van-klinik
//http://localhost:3000/blog/article/slug/duzce-klinik
//http://localhost:3000/blog/article/slug/zonguldak-klinik

module.exports = router;
