// import library for  mongoDB
const mongoose = require('mongoose');

// initialize schema for order
const orderSchema = new mongoose.Schema(
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
        quantity: {
            type: Number,
            default: 1,
            min: 1,
            required: true,
        },
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'restaurants',
            required: true,
        },
        orderStatus: {
            type: String,
            enum: ['processing', 'approved', 'rejected'],
            default: 'processing',
            required: true,
        },
        
    },
    { timestamps: true },
);

// initialize model for order schema
const orderModel = new mongoose.model('orders', orderSchema);

// export order model
module.exports = orderModel;
