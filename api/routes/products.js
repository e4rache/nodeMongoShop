const express = require('express')

const router = express.Router()
const mongoose = require('mongoose')
const Product = require('../models/product')

router.get('/', (req, res, next) => {
    Product.find()
    .select('name price _id')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    _id: doc._id,
                    name: doc.name,
                    price: doc.price,
                    request: {
                        type: 'GET',
                        url: 'http://127.0.0.1:3000/products/' + doc._id
                    }
                }
            })
        }
        res.status(200).json(response)
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
    .then(result => {
        console.log(result)
        res.status(201).json({
            message: 'new product created',
            product: {
                id: result._id,
                name: result.name,
                price: result.price,
                request: {
                    type: 'GET',
                    url: 'http://127.0.0.1:3000/product/'+result._id
                }

            }
        })
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            error: error
        })
    })
})

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId
    Product.findById(id)
    .select('_id name price')
    .exec()
    .then(result => {
        console.log(result)
        if (result) {
            res.status(200).json({
                product: result,
                request: {
                    type: 'GET',
                    url: 'http://127.0.0.1:3000/products/'+result._id 
                }
            })
        } else {
            res.status(404).json({
                message: 'No entry for id:'+id
            })
        }
    }).catch(error => {
        console.log(error)
        res.status(500).json({
            error: error
        })
    })
})

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId
    const updateOps = {}
    // TODO: req.body needs some sort of validation
    // i.e. make sure it is in the form 
    // [ { propName:"..", propValue: "" }, ... ]
    for (const ops of req.body) {
        console.log(`updateOps[${ops.propName}] = ${ops.propValue}`)
        updateOps[ops.propName] = ops.propValue
    }
    Product.update({_id: id}, { $set: updateOps })
    .exec()
    .then(result => {
        // console.log()
        res.status(200).json({
            message: 'product updated',
            request: {
                type: 'GET',
                url: 'http://127.0.0.1:3000/products/' + id
            }
        })
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
        res.status(200).json({
            message: 'product deleted'
        })
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            error: error
        })
            
    })
})

module.exports = router