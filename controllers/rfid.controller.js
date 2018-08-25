const { RFID, User } = require('../models')
const { responseError, responseSuccess } = require('../services/util.service')
const validator = require('validator');
const CONFIG = require('../config/config')
const jwt = require('jsonwebtoken')
const {verifyRole, getToken} = require('./../services/user.service')

const assignRFID = (req, res)=>{
    let body = req.body,
        token = getToken(req.headers)
    if(token){
        verifyRole(res, token, (err, role, token_user)=>{
            if(err){
                return res.status(401).send({
                    success: false,
                    message: "Invalid Token"
                })
            }
            if(role=='admin' || role=='owner'){
                User.findOne({email: body.email}, (_err, user)=>{
                    if(_err){
                        return responseError(res, {message: err})
                    }
                    if(!user){
                        return responseError(res, {message: "No user found."})
                    }
                    if(user){
                        let tag = new RFID({
                            user_id: user._id,
                            rfid: body.rfid_tag
                        })
                        tag.save((errorx, success)=>{
                            if(errorx){
                                return responseError(res, {message: 'RFID already assigned.'})
                            } else {
                                return responseSuccess(res, {message: 'User registered', user_id: success.user_id, rfid: success.rfid, date: success.createdAt})
                            }
                        })
                    }
                })
            }
        })
    }
}

const verifyRFID = (req, res) => {
    let rfidTag = req.params.tag
    if(rfidTag){
        RFID.findOne({rfid: rfidTag}, (err, tag)=>{
            if(err){
                return responseError(res, {err})
            }
            else if(!tag){
                return responseError(res, {message: "RFID not found."})
            }
            else if(tag){
                User.findOne({_id: tag.user_id}, (error, user)=>{
                    if(error){
                        return responseError(res,{message: "Some error."})
                    }
                    if(!user){
                        return responseError(res, {message: "User not found."})
                    }
                    else{
                        user.password = 'hidden'
                        return responseSuccess(res, {message: "User found.", user})
                    }
                })
            } else {
                return responseError(res, {message: "RFID not found."})
            }
        })
    }
}

module.exports.assignRFID = assignRFID
module.exports.verifyRFID = verifyRFID