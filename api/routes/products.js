const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET request to /products'
    })
})

router.post('/', (req, res, next) => {
    res.status(201).json({              // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
        message: 'Handling POST request to /products'
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
    res.status(200).json({
        id : id,
        message: 'handling PATCH /products/:productID'
    })
})

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId
    res.status(200).json({
        id:id,
        message: 'handling DELETE /products/:productId'
    })
})

module.exports = router