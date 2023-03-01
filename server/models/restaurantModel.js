// import library for  mongoDB
const mongoose = require('mongoose');

// initialize schema for restaurant
const restaurantSchema = new mongoose.Schema(
    {
        restaurantName: { type: String, required: true, unique:true },
        password: { type: String, required: true },
        address: { type: String, required: true },
        openingTime: { type: String, required: true },
        closingTime: { type: String, required: true, default: 'none' },
        image: { type: String, required: true },
        role: { type: String, default: 'restaurant', enum: 'restaurant' },
        
    },
    { timestamps: true },
);

// initialize model for restaurant schema
const restaurantModel = new mongoose.model('restaurants', restaurantSchema);

// export restaurant model
module.exports = restaurantModel;
