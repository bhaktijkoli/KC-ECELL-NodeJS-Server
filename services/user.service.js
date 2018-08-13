let jwt = require('jsonwebtoken')
const CONFIG = require('./../config/config')
let User = require('./../models/user.model')
let verifyJWT = function (res, token, next) {
    jwt.verify(token, CONFIG.jwt_encryption, function (err, decoded) {
        if (err) return res.send({
            success: false,
            message: 'Invalid token',
            err
        })
        next(decoded)
    })
}
let verifyRole = function (res, token, cb) {
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

module.exports = { verifyRole, verifyJWT, getToken }