const express = require('express');
const router = express.Router();
const appController = require('../controllers/appController');


router.get('/get-decrypted-credentials', appController.getDecryptedCredentials);
router.post('/update-status', appController.updateUserStatus);
router.get('/get-counts', appController.getUserCounts);
router.post('/increment-visitor', appController.incrementVisitorCount);

module.exports = router;
