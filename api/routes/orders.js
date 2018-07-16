const express = require('express')
const mongoose = require('mongoose')

const checkAuth = require('../middleware/check-auth')

const Order = require('../models/order')
const Product = require('../models/product')

const router = express.Router()

router.get('/', checkAuth,(req, res, next) => {
    Order.find()
    .select('_id product quantity')
    .populate('product', '_id name price') // http://mongoosejs.com/docs/populate.html
    .exec()
    .then( docs => {
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://127.0.0.1:300/orders/'+doc._id
                    }
                }
            })
        })
    })
    .catch( error => {
        res.status(500).json({
            error: error
        })
    })
})

router.post('/', checkAuth, (req, res, next) => {
    Product.findById(req.body.productId)
    .then(product => {
        if (!product) {
            return res.status(404).json({
                message: "product not found"
            })
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        })    
        return order.save()
    })
    .then(result => {
        console.log(result)
        res.status(201).json({
            message: 'order stored',
            createdOrder: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity
            },
            request: {
                type: 'GET',
                url: 'http://127.0.0.1:3000/orders/' + result._id
            }
        })
    })
    .catch(error => {
        res.status(500).json({
            message: 'product not found',
            error: error
        })
    })
})

router.get('/:orderId', checkAuth, (req, res, next) => {
    const id = req.params.orderId
    Order.findById(id)
    .select('_id product quantity')
    .populate('product','_id name price') // http://mongoosejs.com/docs/populate.html
    .exec()
    .then(order => {
        if (!order) {
            return res.status(404).json({
                message: 'order not found'
            })
        }
        res.status(200).json({
            order:order,
            request: {
                type: 'GET',
                url: 'http://127.0.0.1:3000/orders/'
            }
        })
    })
    .catch( error => {
        res.status(500).json({
            error: error
        })
    })
})

router.delete('/:orderId', checkAuth, (req, res, next) => {
    const id = req.params.orderId
    Order.remove({_id:id })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'order deleted',
            request: {
                type: "POST",
                url: 'http://127.0.0.1:3000/orders',
                body: {
                    productId: 'ID',
                    quantity: 'Number'
                }
            }
        })
    })
    .catch(error => {
        res.status(500).json({
            error: error
        })
    })
})

module.exports = router