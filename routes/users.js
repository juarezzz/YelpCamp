const express = require('express');
const passport = require('passport');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const controller = require('../controllers/userController')

router.route('/register')
    .get(controller.get_register_user)
    .post(catchAsync(controller.register_user))

router.route('/login')
    .get(controller.get_login_user)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), controller.login_user)

router.get('/logout', controller.logout_user)

module.exports = router;