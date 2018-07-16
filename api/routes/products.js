const express = require('express')
const multer = require('multer')

const router = express.Router()

const checkAuth = require('../middleware/check-auth')

const productsController = require('../controllers/products')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './images/')
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString()+ '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if ( file.mimetype === 'image/jpeg' ||file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5Mb
    },
    fileFilter: fileFilter
})

router.get('/', productsController.getAll)

router.post('/', checkAuth, upload.single('productImage'), productsController.create)

router.get('/:productId', productsController.get)

router.patch('/:productId', checkAuth, productsController.update)

router.delete('/:productId', checkAuth, productsController.delete)

module.exports = router