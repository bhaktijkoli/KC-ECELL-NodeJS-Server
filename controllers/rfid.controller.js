const { RFID, User } = require('../models')
const { responseError, responseSuccess } = require('../services/util.service')
const validator = require('validator');
const CONFIG = require('../config/config')
const jwt = require('jsonwebtoken')

const assignRFID = (req, res)=>{
    res.setHeader('Content-Type', 'application/json')
    let body = req.body
    if(body.email && body.rfid){
        User.findOne({email: body.email}, (err, user)=>{
            if(err){
                return responseError(res, {message: 'Some error'}, 404)
            }
            // Add token auth for admin/owner
            if(user){
                let tag = new RFID({
                    user_id: user._id,
                    rfid: body.rfid,
                    date_activated: Date.now()
                });
                tag.save((err, success)=>{
                    if(err){
                        return responseError(res, {message: 'Error couldn\'t save'})
                    } else {
                        return responseSuccess(res, {message: 'User registered', user_id: success.user_id, rfid: success.rfid, date: success.date_activated})
                    }
                })

            } else {
                return responseError(res, {message: 'Not found'}, 404)
            }
        })
    }
}

module.exports.assignRFID = assignRFID;