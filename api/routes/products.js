const express = require('express')

const router = express.Router()
const mongoose = require('mongoose')
const Product = require('../models/product')

router.get('/', (req, res, next) => {
    Product.find()
    .exec()
    .then(docs => {
        console.log(docs);
        res.status(200).json(docs)
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            error: error
        })
    })
})

router.post('/', (req, res, next) => {

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    })

    product.save()
    /* FIX ME : error.message = 'exec(...) is not a function'
    .exec(result => {
        console.log(result)
    })
    */
    .catch(error => console.log(error))

    res.status(201).json({              // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
        message: 'Handling POST request to /products',
        product: product
    })
})

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId
    if (id === 'special') {
        res.status(200).json({
            message: 'handling GET /products/special'
        })
    } else {
        res.status(200).json({
            id: id,
            message: 'handling GET /products/:productId'
        })
    }
})

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId
    const updateOps = {}
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }
    Product.update({_id: id}, { $set: updateOps })
    .exec()
    .then(result => {
        console.log(result)
        res.status(200).json(result)
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            error: error
        })
    })
})

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId
    Product.remove({ _id: id })
    .exec()
    .then(result => {
        res.status(200).json(result)
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            error: error
        })
            
    })
})

module.exports = router