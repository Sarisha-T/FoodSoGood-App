// import library for  mongoDB
const mongoose = require('mongoose');

// initialize schema for user
const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        password: { type: String, required: true },
        email: { type: String, required: true, unique:true},
        mobile: { type: Number, required: true },
        address: { type: String },
        role: { type: String, default: 'user' },      
    },
    { timestamps: true },
);

// initialize model for user Schema
const userModel = new mongoose.model('users', userSchema);

// export user model
module.exports = userModel;
