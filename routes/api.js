const express = require('express')
const router = express.Router()
const UserController = require('./../controllers/user.controller')
const RFIDController = require('./../controllers/rfid.controller')

router.get('/', function (req, res) {
    res.json({
        success: true,
        message: "Attendance System API",
        data: {
            "version_number": "v0.1.1"
        }
    })
})
router.get('/ping', function(req, res){
    res.status(200).send({
        success: true,
        message: "Pong"
    })
})
router.post('/user', UserController.create)
router.post('/user/login', UserController.login)
router.get('/user', UserController.getUserData)
router.get('/users', UserController.getUsers)
router.put('/user/makeadmin', UserController.makeAdmin)
router.put('/user/makeowner', UserController.makeOwner)
router.put('/user/:id', UserController.update)
router.delete('/users', UserController.remove)

router.post('/rfid', RFIDController.assignRFID)

module.exports = router