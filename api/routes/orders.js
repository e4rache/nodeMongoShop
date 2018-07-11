const express = require('express')

const router = express.Router()

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'handling GET /orders'
    })
})

router.post('/', (req, res, next) => {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    }
    res.status(201).json({
        message: 'handling POST /orders',
        order: order
    })
})

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId
    res.status(200).json({
        id: id,
        message: 'handling GET /orders/:orderId' 
    })
})

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId
    res.status(200).json({
        id: id,
        message: 'handling DELETE /orders/:orderId' 
    })
})

module.exports = router