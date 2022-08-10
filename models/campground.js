const mongoose = require("mongoose");
const { cloudinary } = require("../api/cloudinary.config");
const Review = require("./review");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_250')
}
)

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    images: [ImageSchema],
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, { toJSON: { virtuals: true } })

CampgroundSchema.virtual('properties').get(function () {
    return {
        title: this.title,
        id: this._id
    }
});

CampgroundSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
        if (doc.images.length > 0) {
            for (let image of doc.images) {
                await cloudinary.uploader.destroy(image.filename)
            }
        }
    }
})

const Campground = mongoose.model('Campground', CampgroundSchema);

module.exports = Campground;