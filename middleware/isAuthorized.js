const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");


const isAuthorized = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    if (!(campground.author.equals(req.user.id))) {
        req.flash('error', 'You are not authorized to do this!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
})

module.exports = isAuthorized;