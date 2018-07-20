let express = require('express')
let router = express.Router()
import auth from '../controllers/auth.controller'

router.get('/', auth.home);

router.get('/login', auth.login)

router.get('/register', auth.register)

router.post('/login', auth.doLogin)

router.post('/register', auth.doRegister)

router.get('/logout', auth.logout)

module.exports = router;