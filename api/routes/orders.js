const express = require('express')
const mongoose = require('mongoose')

const checkAuth = require('../middleware/check-auth')

const Order = require('../models/order')
const Product = require('../models/product')

const ordersController = require('../controllers/orders')

const router = express.Router()

router.get('/', checkAuth, ordersController.getAll)

router.post('/', checkAuth, ordersController.create)

router.get('/:orderId', checkAuth, ordersController.get)

router.delete('/:orderId', checkAuth, ordersController.delete)

module.exports = router