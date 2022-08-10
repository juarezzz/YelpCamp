const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHtml: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedAttributes: {},
                    allowedTags: []
                });
                if (clean !== value) {
                    return helpers.error('string.escapeHTML', { value })
                }
                return clean;
            }
        }
    }
})

const Joi = BaseJoi.extend(extension)

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().escapeHtml().required(),
        price: Joi.number().required().min(0),
        images: Joi.array().items(Joi.object({
            url: Joi.string().escapeHtml().required(), filename: Joi.string().escapeHtml().required()
        })),
        location: Joi.string().escapeHtml().required(),
        description: Joi.string().escapeHtml().required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        body: Joi.string().escapeHtml().required()
    }).required()
});