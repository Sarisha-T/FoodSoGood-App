// import library for  mongoDB
const mongoose = require('mongoose');

// initialize schema for cart data
const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true,
        },
        food: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'foods',
            required: true,
        },
        quantity: { type: Number, min: 1,  default: 1, required: true},
    },
    { timestamps: true },
);

// initialize model for cartdata schema
const cartModel = new mongoose.model('cart', cartSchema);

// export cart data model
module.exports = cartModel;
