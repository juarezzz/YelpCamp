const Review = require("../models/review");
const catchAsync = require("../utils/catchAsync");

const isAuthorizedReview = catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
        req.flash('error', 'Cannot find that review!')
        return res.redirect(`/campgrounds/${id}`)
    }
    if (!(review.author.equals(req.user.id))) {
        req.flash('error', 'You are not authorized to do this!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
})

module.exports = isAuthorizedReview;