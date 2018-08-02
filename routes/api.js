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
            "version_number": "v0.1.1"
        }
    })
})

router.post('/user', UserController.create)

router.get('/user', function(req, res){
    let token = getToken(req.headers)
    if (token) {
        verifyRole(res, token, (error, role, user) => {
            if (error) {
                return res.status(401).send({
                    success: false,
                    message: 'Invalid Token'
                })
            }
            user.password = 'hidden'
            return res.send({
                status: role,
                user: user,
            })
        })
    } else {
        return res.status(401).send({
            success: false,
            msg: 'Unauthorized'
        })
    }
})


router.get('/users', function (req, res) {
    let token = getToken(req.headers)
    if (token) {
        verifyRole(res, token, (error, role, user) => {
            if (error) {
                return res.status(404).send({
                    success: false,
                    message: 'Error: Token invalid.'
                })
            }
            if(!role){
                return res.status(404).send({
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
                    if (err) return res.status(404).send({
                        success: false,
                        error: err
                    })
                    res.send({
                        users: users,
                    })
                })
            } else {
                res.status(401).send({
                    success: false,
                    message: 'Unauthorized'
                })
            }
        })
    } else {
        return res.status(401).send({
            success: false,
            msg: 'Unauthorized'
        })
    }
})
router.put('/user/makeadmin', (req, res) => {
    if(typeof req.body.username_to_promote === 'undefined'){
        return res.json({
            success: false,
            message: 'Error: username_to_promote is undefined'
        })
    }
    verifyRole(res, getToken(req.headers), (err, role, user) => {
        if (err) throw err
        if (role == 'admin' || role=='user') {
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
router.put('/user/makeowner', (req, res) => {
    if(typeof req.body.username_to_promote === 'undefined'){
        return res.json({
            success: false,
            message: 'Error: username_to_promote is undefined'
        })
    }
    verifyRole(res, getToken(req.headers), (err, role, user) => {
        if (err) throw err
        if (role == 'admin' || role == 'user') {
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
router.post('/user/login', UserController.login)

var verifyJWT = function (res, token, next) {
    jwt.verify(token, CONFIG.jwt_encryption, function (err, decoded) {
        if (err) return res.send({
            success: false,
            message: 'Invalid token',
            err
        })
        next(decoded)
    })
}
var verifyRole = function (res, token, cb) {
    verifyJWT(res, token, (decoded) => {
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