//import packages
const foodModel = require('../models/foodModel');
const orderModel = require('../models/orderModel');

//middleware checks if food belongs to the restaurant or no
const verifyFood = async (req, res, next) => {
    let name = req.user.restaurantName;
    let _id = req.params.id;

    let food = await foodModel.findOne({ _id }).populate('restaurant');
    console.log(food);
    if (name === food.restaurant.restaurantName) {
        next();
    } else {
        res.status(400).send({
            message: 'your not authorized!!',
            success: false,
        });
    }
};

//check if the order belongs to that restaurant or no
const verifyOrder = async (req, res, next) => {
    let restaurantname = req.user.restaurantName;
    let _id = req.params.id;

    let order = await orderModel.findOne({ _id }).populate('restaurant');
    if (restaurantname === order.restaurant.restaurantName) {
        next();
    } else {
        res.status(400).send({
            message: 'not authorized!!',
            success: false,
        });
    }
};

// exporting middlewares
module.exports = { verifyFood, verifyOrder };
