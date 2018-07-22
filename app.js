const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const pe = require('parse-error')
const cors = require('cors')
const path = require('path')
const apiRoute = require('./routes/api')

const app = express()

const CONFIG = require('./config/config')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

// Passport

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(cors())

app.use('/api', apiRoute)
app.get('/', function(req, res){
    console.log(CONFIG.app)
	res.statusCode = 200;
	res.json({status:"success", message:"Mongo API", data:{}})
});

app.use(function(req, res, next){
    var err = new Error('Not found')
    err.status = 404
    next(err)
})

app.use(function(err, req, res, next){
    res.locals.message = err.message
    res.locals.error = req.app.get('env')==='dev'?err:{}
    res.status(err.status || 500)
    res.render('error')
})
module.exports = app

process.on('unhandledRejection', error=>{
    console.error('Uncaught Error', pe(error))
})
