const express = require('express')
const router = express.Router()

const usersController = require('../controllers/users')

router.post('/signup', usersController.create)

router.post('/signin', usersController.authenticate)

router.delete('/:userId', usersController.delete)

router.get('/', usersController.getAll)

module.exports = router
