const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validate = require('mongoose-validator')

const CONFIG = require('../config/config')
const saltRounds = 15
let UserSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        default: ""
    },
    branch: {
        type: String
    },
    position: {
        type: String,
        required: true,
        default: "Member"
    },
    mobile_number: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
        unique: true,
        sparse: true,
        validate: [validate({
            validator: 'isEmail',
            meesage: 'Not a valid Email.'
        })]
    },
    password: {
        type: String
    },
    role: {
        type: Number,
        enum: [0, 1, 2], // 0 - Member, 1 - Admin, 2 - Owner
        required: true,
        default: 0
    },
    login_date: {
        type: Date,
        required: false
    },
}, {
    timestamps: true
})

var _userSchema = UserSchema

_userSchema.pre('save', async function (next) {
    let user = this
    if (user.isModified('password') || user.isNew) {
        let salt = bcrypt.genSaltSync(saltRounds)
        let hash = bcrypt.hashSync(user.password, salt)
        user.password = hash
        next()
    }
})

_userSchema.method({
    user: this,
    getJWT: function () {
        let expiration_time = parseInt(CONFIG.jwt_expiration)
        return "JWT " + jwt.sign({
            user_id: this.id
        }, CONFIG.jwt_encryption, {
            expiresIn: expiration_time
        })
    },
    toWeb: function () {
        let json = this.toJSON()
        json.id = this._id
        return json
    },
    comparePassword: function (fromBody, fromDB) {
        if (bcrypt.compareSync(fromBody, fromDB)) {
            return true
        }
        return false
    }
})
module.exports = mongoose.model('User', _userSchema)