const fs = require('fs')
const path = require('path')
const basename = path.basename(__filename)
let User = require('./user.model');
let Attendance = require('./attendance.model');
const mongoose = require('mongoose')
const CONFIG = require('../config/config')

if (CONFIG.db_host != '') {
    mongoose.Promise = global.Promise;
    const mongo_uri = 'mongodb://'+CONFIG.db_host+':'+CONFIG.db_port+'/'+CONFIG.db_name
    mongoose.connect(mongo_uri, {useNewUrlParser: true}).catch((err)=>{
        console.log('[-]\tCan\'t connect to Mongo Server'+mongo_uri)
    })

    let db = mongoose.connection
    module.exports = db
    db.once('open', ()=>{
        console.log('[+]\tConnected to MongoDB at '+mongo_uri)
    })
    db.on('error', (err)=>{
        console.log('[-]\tError: '+err)
    })
} else {
    console.log('[-]\tNo Credentials Passed')
}

module.exports = {User, Attendance};