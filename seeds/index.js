const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors} = require('./seedsHelper')
const Campground = require('../models/campgrounds')

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
    for (let i=0; i < 50; i++) {
        const randomNum = Math.floor(Math.random() * 1000)
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[randomNum].city}, ${cities[randomNum].state}`,
            price: `$${Math.ceil(Math.random() * 100000 + 100)},00`
        })
        await camp.save();
    }
    db.close()
}

seedDB();