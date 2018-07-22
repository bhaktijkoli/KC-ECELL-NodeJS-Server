const express = require('express')
const router = express.Router()
var jwt = require('jsonwebtoken')

const UserController = require('./../controllers/user.controller.js')
let User = require('../models/user.model')
const CONFIG = require('../config/config')

let getToken = (headers) => {
    if (headers && headers['authorization']) {
        let parted = headers.authorization.split(' ')
        if (parted.length === 2) {
            return parted[1]
        } else {
            return null
        }
    } else {
        return null
    }
}
router.get('/', function (req, res, next) {
    res.json({
        success: true,
        message: "Attendance System API",
        data: {
            "version_number": "v0.1.0"
        }
    })
})

router.post('/users', UserController.create)

router.get('/users', function (req, res) {
    let token = getToken(req.headers)
    if (token) {
        verifyRole(token, (error, role, user) => {
            if (error) {
                return res.json({
                    success: false,
                    message: 'Error: Token invalid.'
                })
            }
            if(!role){
                return res.json({
                    success: false,
                    message: 'Error: Role not found.'
                })
            }
            if (role == 'admin' || role == 'owner') {
                User.find((err, users) => {
                    users.forEach(userX => {
                        userX.password = "hidden"
                        userX['role'] = "hidden"
                        userX.email="hidden"
                    })
                    if (err) return res.send({
                        success: false,
                        error: err
                    })
                    res.send({
                        user: user,
                        users: users,
                    })
                })
            } else {
                user.password = 'hidden'
                res.send({
                    status: role,
                    user: user,
                })
            }
        })
    } else {
        return res.status(401).send({
            success: false,
            msg: 'Unauthorizzed'
        })
    }
})
router.put('/users/registeradmin', (req, res) => {
    verifyRole(getToken(req.headers), (err, role, user) => {
        if (err) throw err
        if (role == 'admin') {
            return res.json({
                success: false,
                message: 'Error: You don\'t have access to promote.'
            })
        } else if (role == 'owner') {
            User.updateOne({username: req.body.username_to_promote}, {role: 1}, (err, raw) => {
                if(err) throw err
                if (raw.ok!=1) {
                    return res.json({
                        success: false,
                        message: 'Error'
                    })
                }
                if (raw.n == 0){
                    return res.json({
                        success: false,
                        message: 'User not found'
                    })
                }
                if(raw.nModified == 0 && raw.ok == 1){
                    return res.json({
                        success: false,
                        message: 'Already admin'
                    })
                }
                
                return res.json({
                    success: true,
                    message: 'User promoted to admin'
                })
            })
        }
    })
})
router.put('/users/registerowner', (req, res) => {
    if(typeof req.body.username_to_promote === 'undefined'){
        return res.json({
            success: false,
            message: 'Error: username_to_promote is undefined'
        })
    }
    verifyRole(getToken(req.headers), (err, role, user) => {
        if (err) throw err
        if (role == 'admin') {
            return res.json({
                success: false,
                message: 'Error: You don\'t have access to promote.'
            })
        } else if (role == 'owner') {
            User.updateOne({username: req.body.username_to_promote}, {role: 2}, (err, raw) => {
                if(err) throw err
                if (raw.ok!=1) {
                    return res.json({
                        success: false,
                        message: 'Error'
                    })
                }
                if (raw.n == 0){
                    return res.json({
                        success: false,
                        message: 'User not found'
                    })
                }
                if(raw.nModified == 0 && raw.ok == 1){
                    return res.json({
                        success: false,
                        message: 'Already owner'
                    })
                }
                return res.json({
                    success: true,
                    message: 'User promoted to owner.'
                })
            })
        }
    })
})
router.put('/users', UserController.update)
router.delete('/users', UserController.remove)
router.post('/users/login', UserController.login)

var verifyJWT = function (token, next) {
    jwt.verify(token, CONFIG.jwt_encryption, function (err, decoded) {
        if (err) res.send({
            success: false,
            message: 'Token is invalid.\n'+err
        })
        next(decoded)
    })
}
var verifyRole = function (token, cb) {
    verifyJWT(token, (decoded) => {
        User.findById(decoded.user_id, (err, user) => {
            if (err) cb(err, null, null)
            if (!user) cb(null, {
                message: 'Not found'
            }, null)
            user.password = 'hidden'
            if (user.role === 1) {
                cb(null, 'admin', user)
            } else if (user.role === 2) {
                cb(null, 'owner', user)
            } else {
                cb(null, 'user', user)
            }
        })
    })
}
router.get('/ping', function(req, res){
    res.status(200).send({
        success: true,
        message: "Pong"
    })
})
module.exports = router