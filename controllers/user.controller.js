const { User } = require('../models')
const { responseError, responseSuccess } = require('../services/util.service')
const validator = require('validator');
const CONFIG = require('../config/config')
const jwt = require('jsonwebtoken')
const create = async function (req, res) {
    res.setHeader('Content-Type', 'application/json')
    const body = req.body
    if (!(body.username && body.password && body.email && body.fullname && body.mobile_number && body.branch && body.position)){
        return responseError(res, 'Please enter all the required fields.', 406)
    } else if (body.password !== body.password_conf){
        return responseError(res, 'Passwords don\'t match!')
    } else if (!validator.isEmail(body.email)) {
        return responseError(res, 'Invalid Email')
    } else {
        let user = new User({
            username: body.username,
            email: body.email,
            password: body.password,
            fullname: body.fullname,
            position: body.position,
            mobile_number: body.mobile_number,
            branch: body.branch,
            login_date: Date.now(),
            role: 0
        })
        user.save(function(err, user){
            if(err){
                return responseError(res, 'User already exisits', 406)
            }
            return responseSuccess(res, {message: 'User registered', username: user.username}, 201)
        })
    }
}
const get = async function(req, res) {
    res.setHeader('Content-Type', 'application/json')
    let username = req.username
    jwt.verify(res.token, CONFIG.jwt_encryption, function(err, token) {
        responseSuccess(res, {username: username, token: token})
    });
}
const update = async function(req, res){}
const remove = async function(req, res){}
const login = async function(req, res) {
    res.setHeader('Content-Type', 'application/json')
    let body = req.body
    if(!body.email){
        return responseError(res, {success: false, message: 'Please enter email'}, 406)
    }
    if(!body.password){
        return responseError(res, {success: false, message: 'Please enter password'}, 406)
    }
    if(validator.isEmail(body.email)){
        User.findOne({email:body.email}, function(err, user){
            if(err){
                return responseError(res, {message: 'No such email.'}, 404)
            } else if(user.comparePassword(body.password, user.password)) {
                res.setHeader('Authorization', user.getJWT())
                return responseSuccess(res, {token:user.getJWT(), user: user.username}, 202)
            } else {
                return responseError(res, {message: 'Error'}, 404)
            }            
        })
    } else {
        return responseError(res, {success: false, message: 'Invalid Email'}, 404)
    }
}
module.exports.create = create;
module.exports.get = get;
module.exports.update = update;
module.exports.remove = remove;
module.exports.login = login;