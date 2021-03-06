const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: {
        type: String
    },
    price: {
        type: String
    },
    description: {
        type: String
    },
    location: {
        type: String
    }
})

const Campground = mongoose.model('Campground', CampgroundSchema);

module.exports = Campground;