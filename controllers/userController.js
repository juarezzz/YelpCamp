const User = require('../models/user');

module.exports.get_register_user = (req, res) => {
    res.render('users/register');
}

module.exports.register_user = async (req, res, next) => {
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
}

module.exports.get_login_user = (req, res) => {
    const returnURL = req.query.from
    res.render('users/login', { returnURL });
}

module.exports.login_user = (req, res) => {
    const returnURL = req.query.from ?? '/campgrounds';
    req.flash('success', 'Welcome back!');
    res.redirect(returnURL);
}

module.exports.logout_user = (req, res, next) => {
    req.logout(err => {
        if (err) { return next(err); }
        req.flash('success', 'Logged out successfully!');
        res.redirect('/campgrounds');
    });
}