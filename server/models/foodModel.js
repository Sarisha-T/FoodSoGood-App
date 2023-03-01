// import library for  mongoDB
const mongoose = require('mongoose');

// initialize schema for foods
const foodSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        description: { type: String, required: true, minlength: 10 },
        image: { type: String, required: true },
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'restaurants',
            required: true,
        },
    },
    { timestamps: true },
);

// initialize model for food schema
const foodModel = new mongoose.model('foods', foodSchema);

// export food model
module.exports = foodModel;
