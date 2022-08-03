const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const isLoggedIn = require('../middleware/isLoggedIn')
const isAuthorized = require('../middleware/isAuthorized');
const validateCampground = require('../middleware/validateCampground');
const controller = require('../controllers/campgroundController');

router.route('/')
    .get(catchAsync(controller.get_all_campground))
    .post(isLoggedIn, validateCampground, catchAsync(controller.create_campground))

router.get('/new', isLoggedIn, catchAsync(controller.get_create_campground))

router.route('/:id')
    .get(catchAsync(controller.get_details_campground))
    .put(isLoggedIn, isAuthorized, validateCampground, catchAsync(controller.update_campground))
    .delete(isLoggedIn, isAuthorized, catchAsync(controller.delete_campground))

router.get('/:id/edit', isLoggedIn, isAuthorized, catchAsync(controller.get_update_campground))

module.exports = router;