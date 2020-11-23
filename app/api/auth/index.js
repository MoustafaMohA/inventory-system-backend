'use strict';

const authController = require('./auth.controller');
const express = require('express');
const router = express.Router();

router.post('/login', authController.login);
router.get('/logout', authController.verifyToken, authController.logout);

module.exports = router;
