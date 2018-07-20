import mongoose from 'mongoose';
let Schema = mongoose.Schema;
let passportLocalMongoose = require('passport-local-mongoose')

let UserSchema = new Schema({
    fullname: {
        type: String,
        required: true,
        default: ""
    },
    username: {
        type: String,
        required: true,
    },
    branch: {
        type: String,
        required: true
    },
    post: {
        type: String,
        required: true,
        default: "Member"
    },
    address: {
        type: String,
        required: true
    },
    mobile_number: {
        type: String,
        required: true
    },
    photograph: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    register_date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    status: {
        type: Number,
        enum: [0, 1, 2], // 0 - Member, 1 - Admin, 2 - Owner
        required: true,
        default: 0
    },
    login_date: {
        type: Date,
        required: false
    },
    updated_at: {
        type: Date,
        default: Date.now(),
        required: true
    }
});
UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema);