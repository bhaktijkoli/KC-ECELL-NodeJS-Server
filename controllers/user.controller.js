const {
  User
} = require('../models')
const {
  responseError,
  responseSuccess
} = require('../services/util.service')
const validator = require('validator');
const {
  verifyRole,
  getToken
} = require('./../services/user.service')

const create = (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  User.count({role: 1}, (err, adminCount) => {
    if(err) throw err
    const body = req.body
    if (!(body.email && body.password && body.fullname && body.mobile_number && body.branch && body.position)) {
      return responseError(res, 'Please enter all the required fields.', 406)
    } else if (body.password !== body.password_conf) {
      return responseError(res, 'Passwords don\'t match!')
    } else if (!validator.isEmail(body.email)) {
      return responseError(res, 'Invalid Email')
    } else {
      let user = new User({
        email: body.email,
        password: body.password,
        fullname: body.fullname,
        position: body.position,
        mobile_number: body.mobile_number,
        branch: body.branch,
        login_date: Date.now(),
        role: adminCount == 0 ? 1 : 0
      })
      user.save(function (err, user) {
        if (err) {
          return responseError(res, 'User already exisits', 406)
        }
        return responseSuccess(res, {
          message: 'User registered',
          _id: user._id
        }, 201)
      })
    }
  })

}
const getUserData = (req, res) => {
  let token = getToken(req.headers)
  if (token) {
    verifyRole(res, token, (error, role, user) => {
      if (error) {
        return res.status(401).send({
          success: false,
          message: 'Invalid Token'
        })
      }
      user.password = 'hidden'
      return res.send({
        success: true,
        status: role,
        user: user,
      })
    })
  } else {
    return res.status(401).send({
      success: false,
      msg: 'Unauthorized'
    })
  }
}
const getUsers = (req, res) => {
  let token = getToken(req.headers)
  if (token) {
    verifyRole(res, token, (error, role, user) => {
      if (error) {
        return res.status(404).send({
          success: false,
          message: 'Error: Token invalid.'
        })
      }
      if (!role) {
        return res.status(404).send({
          success: false,
          message: 'Error: Role not found.'
        })
      }
      User.find((err, users) => {
        users.forEach(userX => {
          userX.password = "hidden"
          userX.email = "hidden"
        })
        if (err) return res.status(404).send({
          success: false,
          error: err
        })
        res.send({
          users: users,
        })
      })
    })
  } else {
    return res.status(401).send({
      success: false,
      msg: 'Unauthorized'
    })
  }
}
const login = (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  let body = req.body
  if (!body.email) {
    return responseError(res, {
      success: false,
      message: 'Please enter email'
    }, 406)
  }
  if (!body.password) {
    return responseError(res, {
      success: false,
      message: 'Please enter password'
    }, 406)
  }
  if (validator.isEmail(body.email)) {
    User.findOne({
      email: body.email
    }, function (err, user) {
      if (err) {
        return responseError(res, {
          message: 'No such email.'
        }, 404)
      } else if (user.comparePassword(body.password, user.password)) {
        res.setHeader('Authorization', user.getJWT())
        return responseSuccess(res, {
          token: user.getJWT(),
          id: user._id
        }, 202)
      } else {
        return responseError(res, {
          message: 'Login failed'
        }, 404)
      }
    })
  } else {
    return responseError(res, {
      success: false,
      message: 'Invalid Email'
    }, 404)
  }
}
const update = (req, res) => {} // Pending
const remove = (req, res) => {} // Pending
const makeAdmin = (req, res) => {
  if (typeof req.body.email_to_promote === 'undefined') {
    return res.json({
      success: false,
      message: 'Error: email_to_promote is undefined'
    })
  }
  verifyRole(res, getToken(req.headers), (err, role, user) => {
    console.log(req.headers)
    if (err) throw err
    if (role == 'admin' || role == 'user') {
      return res.json({
        success: false,
        message: 'Error: You don\'t have access to promote.'
      })
    } else if (role == 'owner') {
      User.updateOne({
        email: req.body.email_to_promote
      }, {
        role: 1
      }, (err, raw) => {
        if (err) throw err
        if (raw.ok != 1) {
          return res.json({
            success: false,
            message: 'Error'
          })
        }
        if (raw.n == 0) {
          return res.json({
            success: false,
            message: 'User not found'
          })
        }
        if (raw.nModified == 0 && raw.ok == 1) {
          return res.json({
            success: false,
            message: 'Already admin'
          })
        }

        return res.json({
          success: true,
          message: 'User promoted to admin'
        })
      })
    }
  })
}
const makeOwner = (req, res) => {
  if (typeof req.body.email_to_promote === 'undefined') {
    return res.json({
      success: false,
      message: 'Error: email_to_promote is undefined'
    })
  }
  verifyRole(res, getToken(req.headers), (err, role, user) => {
    if (err) throw err
    if (role == 'admin' || role == 'user') {
      return res.json({
        success: false,
        message: 'Error: You don\'t have access to promote.'
      })
    } else if (role == 'owner') {
      User.updateOne({
        email: req.body.email_to_promote
      }, {
        role: 2
      }, (err, raw) => {
        if (err) throw err
        if (raw.ok != 1) {
          return res.json({
            success: false,
            message: 'Error'
          })
        }
        if (raw.n == 0) {
          return res.json({
            success: false,
            message: 'User not found'
          })
        }
        if (raw.nModified == 0 && raw.ok == 1) {
          return res.json({
            success: false,
            message: 'Already owner'
          })
        }
        return res.json({
          success: true,
          message: 'User promoted to owner.'
        })
      })
    }
  })
}
module.exports.create = create;
module.exports.login = login;
module.exports.getUserData = getUserData;
module.exports.getUsers = getUsers;
module.exports.update = update;
module.exports.remove = remove;
module.exports.makeAdmin = makeAdmin;
module.exports.makeOwner = makeOwner;
