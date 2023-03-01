//import packages
const express = require('express');

//import middlewares
const verifyUser = require('../middlewares/verifyUser');

//import mongoDB models
const cartModel = require('../models/cartModel');
const foodModel = require('../models/foodModel');
const orderModel = require('../models/orderModel');

//initialize router obj
const router = express.Router();

//route to add food to cart
router.post('/addItem', verifyUser, async (req, res) => {
    let data = req.body;
    const cartItems = new cartModel(data);
    cartItems
        .save()
        .then(() => {
            res.status(200).send({
                message: 'Item is added to cart',
                success: true,
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({
                message: 'Unable to addItem to Cart',
                success: false,
            });
        });
});

//route to delete food from cart
router.delete('/deleteFood/:id', verifyUser, async (req, res) => {
    let _id = req.params.id;
    cartModel
        .deleteOne({ _id })
        .then(() =>
            res
                .status(200)
                .send({ message: 'Cart Item delted!!!', success: true }),
        )
        .catch((err) => {
            console.log(err);
            res.status(400).send({
                message: 'unable to delte cart item',
                success: false,
            });
        });
});

//update cart item
router.put('/updateFood/:id',verifyUser, (req, res) => {
    let _id = req.params.id;
    let updatedData = req.body;
    cartModel
        .updateOne({ _id }, updatedData)
        .then(() =>
            res.status(200).send({
                message: 'data is updated',
                success: true,
            }),
        )
        .catch((err) => {
            console.log(err);
            res.status(400).send({
                message: 'Unable to update cart items',
                success: false,
            });
        });
});

//proceed to checkout with cart details
router.post('/checkOut', verifyUser, async (req, res) => {
    let cartItems = req.body.cartItems;

    cartItems.map(async (cart, index) => {
        let foodId = cart.food;
        let food = await foodModel.findOne({ _id: foodId });

        if (food.quantity > 0) {
            let orderData = {
                user: cart.user,
                food: foodId,
                restaurant: food.restaurant,
                quantity: cart.quantity,
            };
            const orders = new orderModel(orderData);
            orders
                .save()
                .then(async () => {
                    await cartModel.deleteOne({ _id: cart });
                    await foodModel.updateOne(
                        { _id: foodId },
                        { quantity: food.quantity - orderData.quantity },
                    );
                    if (cartItems.length === index + 1) {
                        res.status(200).send({
                            message: 'Ordered!!!',
                            success: true,
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    res.status(400).send({
                        message: 'order Rejected!!!',
                        success: false,
                    });
                });
        } else {
            res.status(400).send({
                message: 'Order rejected, Out of Stock',
                success: false,
            });
        }
    });
});

//export router obj
module.exports = router;
