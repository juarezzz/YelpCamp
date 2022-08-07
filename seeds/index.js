const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors } = require('./seedsHelper')
const Campground = require('../models/campground')
const Review = require('../models/review')

mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log('Database connected');
})

function sample(array) {
    return array[Math.floor(Math.random() * array.length)]
}

async function seedDB() {
    await Campground.deleteMany({});
    await Review.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const randomNum = Math.floor(Math.random() * 1000)
        const randomCity = cities[randomNum]
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${randomCity.city}, ${randomCity.state}`,
            price: Math.ceil(Math.random() * 100000 + 100),
            description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit.Quisquam explicabo cupiditate libero ullam nisi reiciendis ducimus eaque enim aperiam! Illo aperiam doloremque fugit iure, illum nostrum officiis blanditiis soluta placeat.",
            author: '62e462ea39e3491d652e58f2',
            images: [
                {
                    url: 'https://res.cloudinary.com/du7yqh30m/image/upload/v1659583567/yelp-camp/pucn1exgcpqb5vkf0yd7.jpg',
                    filename: 'yelp-camp/pucn1exgcpqb5vkf0yd7'
                }
            ],
            geometry: {
                type: 'Point',
                coordinates: [
                    randomCity.longitude,
                    randomCity.latitude
                ]
            }

        })
        await camp.save();
    }
    db.close()
}

seedDB();