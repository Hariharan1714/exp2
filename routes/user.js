const express = require('express');

const userController = require('../controller/user');

const router = express.Router();


router.post('/signup', userController.signup);

router.post('/login', userController.login);

router.post('/forgotpassword', userController.forgotPassword);

router.post('/reset/:token', userController.resetPassword);

module.exports = router;