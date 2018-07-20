import mongoose from 'mongoose'
import passport from 'passport'
import User from '../models/User';


let userController = {}

userController.home = (req, res) => {
    res.render('index', {
        user: req.user
    })
}

userController.register = (req, res) => {
    res.render('register')
}

userController.doRegister = (req, res) => {
    User.register(
        new User({
            fullname: req.body.fullname,
            username: req.body.username,
            email: req.body.email,
            branch: req.body.branch,
            post: req.body.post_description,
            address: req.body.address_description,
            mobile_number: req.body.mobile_number,
            photograph: req.body.photograph,
            register_date: Date.now(),
            updated_at: Date.now(),
        }
    ), req.body.password, (err, user) => {
        if (err) {
            console.log(err)
            return res.render('register', {
                user: user
            });
        }
        console.log(user);
        
        passport.authenticate('local')(req, res, () => {
            res.redirect('/');
        });
    })
}

userController.login = (req, res) => {
    res.render('login');
};

// Post login
userController.doLogin = (req, res) => {
    console.log("LOGIN");
    passport.authenticate('local')(req, res, () => {
        res.redirect('/')
    })
}

// logout
userController.logout = (req, res) => {
    req.logout()
    res.redirect('/')
}

module.exports = userController;