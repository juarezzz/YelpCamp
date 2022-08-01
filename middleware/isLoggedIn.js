const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be logged in!');
        return res.redirect(`/login?from=${encodeURIComponent(req.originalUrl)}`);
    }
    next();
}

module.exports = isLoggedIn;