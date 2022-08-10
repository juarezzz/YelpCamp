const Campground = require('../models/campground');
const { cloudinary } = require('../api/cloudinary.config');
const geocodingClient = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoder = geocodingClient({ accessToken: process.env.MAPBOX_TOKEN });

module.exports.get_all_campground = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.get_create_campground = async (req, res) => {
    res.render('campgrounds/new');
}

module.exports.create_campground = async (req, res) => {
    const geodata = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    if (geodata.body.features.length === 0) {
        req.flash('error', `Could not find "${req.body.campground.location}" on the map!`)
        console.log(req.get('Referrer'));
        return res.redirect('back');
    }
    const newCampground = new Campground(req.body.campground);
    const images = req.files.map(file => ({ url: file.path, filename: file.filename }));
    newCampground.images = images;
    newCampground.geometry = geodata.body.features[0].geometry;
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${newCampground._id}`);
}

module.exports.get_details_campground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
        .populate({ path: 'reviews', populate: { path: 'author' } })
        .populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });
}

module.exports.get_update_campground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.update_campground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const images = req.files.map(file => ({ url: file.path, filename: file.filename }));
    campground.images.push(...images);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${id}`);
}

module.exports.delete_campground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
};