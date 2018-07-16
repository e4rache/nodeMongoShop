const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

exports.create = (req, res, next) => {
    User.find({
        email: req.body.email
    })
    .exec()
    .then( user => {
        if (user.length >= 1) {
            return res.status(409).json({
                message: 'email already exists'
            })
        } else {
            bcrypt.hash(req.body.password, 10, (error, hash) => {
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
}

exports.authenticate = (req, res, next) => {
    User.findOne({ email: req.body.email})
    .exec()
    .then(user => {
        if (!user) {
            return res.status(401).json({
                message: 'authentication failed'
            })
        }
        bcrypt.compare(req.body.password, user.password, (error, result) => {
            if (error) {
                return res.status(401).json({
                    message: 'authentication failed',
                })
            }
            if (result) {
                const token = jwt.sign({
                    email: user.email,
                    userId: user._id
                }, process.env.JWT_KEY, {
                    expiresIn: "1h"
                })
                return res.status(200).json({
                    message: 'authentication successful',
                    token: token
                })
            } else { // wrong password
                return res.status(401).json({
                    message: 'authentication failed'
                })
            }
        })
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            error: error
        })
    })
}

exports.delete = (req, res, next) => {
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
}

exports.getAll = (req, res, next) => {
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
}