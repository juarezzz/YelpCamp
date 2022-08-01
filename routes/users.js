const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const newUser = new User({ email, username });
        await User.register(newUser, password);
        req.login(newUser, err => {
            if (err) { return next(err) }
            req.flash('success', 'Successfully registered!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('back');
    }
}))

router.get('/login', (req, res) => {
    const returnURL = req.query.from || encodeURIComponent('/campgrounds')
    res.render('users/login', { returnURL });
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: 'back' }), (req, res) => {
    const returnURL = req.query.from;
    req.flash('success', 'Welcome back!');
    res.redirect(returnURL);
})

router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) { return next(err); }
        req.flash('success', 'Logged out successfully!');
        res.redirect('/campgrounds');
    });
})

module.exports = router;