import http from 'http'
import path from 'path'
import cors from 'cors'
import logger from 'morgan'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import methodOverride from 'method-override'
import mongoose from 'mongoose'
import restful from 'node-restful'
let express = require('express')

import passport from 'passport'
import {Strategy} from 'passport-local'
import config from './config.json'
import indexRoute from './routes/index'
import User from './models/User'

let app = express();

app.server = http.createServer(app)
// Database - MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(config.db_uri+config.db_name)
.then(() => console.log('[+]\tConnection successful'))
.catch((err) => console.error(err));

app.use(logger('dev'))
app.use(cors({
    exposedHeaders: config.corsHeaders
}))
app.use(bodyParser.json({
    limit: config.bodyLimit
}))
app.use(bodyParser.urlencoded({
    'extended': 'true'
}));
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));
app.use(methodOverride());
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'secret_key_here',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// // Restful API
// let Users = app.resource = restful.model('users', UserSchema).methods(['get', 'post', 'put', 'delete'])
// Passport.js Auth
passport.use(new Strategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// View Engine PUG
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('/', indexRoute);
// app.use('/users', userRoute);
// Error Handling for 404
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// Error Handler
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;