const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getProducts);
router.get('/product-detail/:productId', productController.getProduct);
router.get('/product-detail/slug/:slug', productController.getProductBySlug);

//http://localhost:3000/products/product-detail/slug/kedi-tuvaleti
//http://localhost:3000/products/product-detail/slug/kedi-kuru-mama
//http://localhost:3000/products/product-detail/slug/mama-kuregi
//http://localhost:3000/products/product-detail/slug/mama-kabi
//http://localhost:3000/products/product-detail/slug/kedi-macunu
//http://localhost:3000/products/product-detail/slug/dogal-kedi-kumu
//http://localhost:3000/products/product-detail/slug/parfumsuz-kedi-kumu

module.exports = router;
