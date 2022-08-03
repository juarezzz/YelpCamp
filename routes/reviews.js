const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const isLoggedIn = require('../middleware/isLoggedIn');
const isAuthorizedReview = require('../middleware/isAuthorizedReview');
const validateReview = require('../middleware/validateReview');
const controller = require('../controllers/reviewController');

router.post('/', isLoggedIn, validateReview, catchAsync(controller.create_review))

router.delete('/:reviewId', isLoggedIn, isAuthorizedReview, catchAsync(controller.delete_review))

module.exports = router;