const express = require('express');
const router = express.Router();
const adminCheck = require('../middlewares/adminCheck');
const adminController = require('../controllers/adminController');

// Protect all routes in this file with the adminCheck middleware
router.use(adminCheck);


router.get('/', adminController.getInfo);
router.get('/articles', adminController.getArticles);
router.get('/categories', adminController.getCategories);
router.get('/admins', adminController.getAdmins);
router.get('/products', adminController.getProducts);

router.post('/add-category', adminController.addCategory);
router.post('/add-product', adminController.addProduct);
router.post('/add-article', adminController.addArticle);
router.post('/add-user', adminController.addUser);

router.delete('/delete-category/:id', adminController.deleteCategory);
router.delete('/delete-product/:id', adminController.deleteProduct);
router.delete('/delete-article/:id', adminController.deleteArticle);
router.delete('/delete-admin/:id', adminController.deleteUser);  

module.exports = router;
