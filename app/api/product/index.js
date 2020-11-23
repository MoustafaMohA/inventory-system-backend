'use strict';

const express = require('express');
const router = express.Router();
const productController = require('./product.controller')
const authController = require('../auth/auth.controller');

router.get('/', authController.verifyToken, productController.list);
router.get('/:id', authController.verifyToken, productController.get);
router.post('/', authController.verifyToken, productController.create);
router.delete('/:id', authController.verifyToken, productController.delete);
router.post('/delete-all', authController.verifyToken, productController.deleteAll);

module.exports = router;
