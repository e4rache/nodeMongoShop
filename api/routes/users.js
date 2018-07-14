const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const User = require('../models/user')

const router = express.Router()

router.post('/signup', (req, res, next) => {
    User.find({
        email: req.body.email
    })
    .exec()
    .then( user => {
        if (user.length >= 1) {
            return res.status(409).json({
                message: 'mail exists'
            })
        } else {
            bcrypt.hash(req.body.email, 10, (error, hash) => {
                if (error) {
                    return res.status(500).json({
                        error: error
                    })
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    })
                    user.save()
                    .then(result => {
                        console.log(result)
                        res.status(201).json({
                            message: 'user created'
                        })
                    })
                    .catch(error => {
                        console.log(error)
                        res.status(500).json({
                            error: error
                        })
                    })
                }
            })
        }
    })
})

router.delete('/:userId', (req, res, next) => {
    User.remove({ _id: req.params.userId })
    .exec()
    .then( result => {
        res.status(200).json({
            message: 'user deleted'
        })
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            error: error
        })
    })
})

router.get('/', (req, res, next) => {
    User.find()
    .select('email password')
    .exec()
    .then(result => {
        console.log(result)
        res.status(400).json({
            users: result
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