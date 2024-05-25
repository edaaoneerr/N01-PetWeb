const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.postLogin);
router.post('/register', authController.postRegister);
router.get('/logout', authController.logout);
router.get('/auto-login', authController.autoLogin);

module.exports = router;
