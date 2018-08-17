const { RFID, User } = require('../models')
const { responseError, responseSuccess } = require('../services/util.service')
const validator = require('validator');
const CONFIG = require('../config/config')
const jwt = require('jsonwebtoken')
const {verifyRole, getToken} = require('./../services/user.service')

const assignRFID = (req, res)=>{
    let body = req.body,
        token = getToken(req.headers)
    // Add token auth for admin/owner
    verifyRole(res, token, (err, role)=>{
        if(err){
            return res.status(401).send({
                success: false,
                message: "Invalid Token"
            })
        }
        if(role=='admin' || role=='owner'){
            if(body.email && body.rfid){
                User.findOne({email: body.email}, (err, user)=>{
                    if(err){
                        return responseError(res, {message: 'Some error'}, 404)
                    }
                    if(user){
                        let tag = new RFID({
                            user_id: user._id,
                            rfid: body.rfid
                        });
                        tag.save((err, success)=>{
                            if(err){
                                return responseError(res, {message: 'Error couldn\'t save'})
                            } else {
                                return responseSuccess(res, {message: 'User registered', user_id: success.user_id, rfid: success.rfid, date: success.createdAt})
                            }
                        })
        
                    } else {
                        return responseError(res, {message: 'Not found'}, 404)
                    }
                })
            }
        } else {
            return responseError(res, {message: "Unauthorized"}, 401)
        }
    })
}

module.exports.assignRFID = assignRFID;