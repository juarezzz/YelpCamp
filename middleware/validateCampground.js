const { campgroundSchema } = require('../schemas');
const ExpressError = require('../utils/ExpressError');

const validateCampground = (req, res, next) => {
    const campgroundObject = {}
    campgroundObject.campground = { ...req.body.campground }
    const images = req.files.map(file => ({ url: file.path, filename: file.filename }));
    campgroundObject.campground.images = images;
    const { error } = campgroundSchema.validate(campgroundObject);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports = validateCampground;