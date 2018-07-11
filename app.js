const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const app = express()


const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')

// middlewares

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// routes

app.use('/products', productRoutes)
app.use('/orders', orderRoutes)

// CORS
///* Somehow, adding this call makes unrouted url time out. Not sure why yet.
app.use((req, res, next) => {
    res.header('Acess-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type, Accept, Authorization')
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        // It doesn't need to continue to the routes
        // if the method was OPTIONS
        return res.status(200).json({})
    }
})
//*/

// error handling

app.use((req, res, next) => {
    const error = new Error('route not implemented')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app