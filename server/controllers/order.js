//import packages
const express = require('express');

//import middlewares
const verifyUser = require('../middlewares/verifyUser');
const verifyRestaurant = require('../middlewares/verifyRestaurant');
const verifyOrder =
    require('../middlewares/verifyFood').verifyOrder;

//import mongoDB models
const orderModel = require('../models/orderModel');
const foodModel = require('../models/foodModel');


//initialize router obj
const router = express.Router();

//order food
router.post('/neworder', verifyUser, async (req, res) => {
    let orderData = req.body;

    let food = await foodModel.findOne({ _id: orderData.food });

    let quantity = food.quantity;
    if (quantity > 0) {
        const orders = new orderModel(orderData);
        orders
            .save()
            .then(async () => {
                await foodModel.updateOne(
                    { _id: orderData.food },
                    { quantity: quantity - orderData.quantity },
                );

                res.status(200).send({ message: 'Ordered!!!', success: true });
            })
            .catch((err) => {
                console.log(err);
                res.status(400).send({
                    message: 'Order rejected',
                    success: false,
                });
            });
    } else {
        res.status(400).send({
            message: 'Order rejected, Out of Stock',
            status: false,
        });
    }
});

//update order state
router.put(
    '/orderstate/:id',
    verifyUser,
    verifyRestaurant,
    verifyOrder,
    async (req, res) => {
        let _id = req.params.id;
        let updatedData = req.body;

        if (updatedData.orderStatus === 'rejected') {
            let food = await foodModel.findOne({
                _id: updatedData.food,
            });

            await foodModel.updateOne(
                { _id: updatedData.food },
                { quantity: food.quantity + updatedData.quantity },
            );
        }

        orderModel
            .updateOne({ _id }, { orderStatus: updatedData.orderStatus })
            .then(async () => {
                if (updatedData.orderStatus === 'rejected') {
                    let food = await foodModel.findOne({
                        _id: updatedData.food,
                    });

                    let quantity = food.quantity + updatedData.quantity;

                    foodModel
                        .updateOne(
                            { _id: updatedData.food },
                            {
                                quantity,
                            },
                        )
                        .then(() =>
                            res.status(200).send({
                                message: `order ${updatedData.orderStatus}`,
                                success: true,
                            }),
                        )
                        .catch((err) => console.log(err));
                } else {
                    res.status(200).send({
                        message: `order ${updatedData.orderStatus}`,
                        success: true,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                res.status(400).send({
                    message: `unable to change the status of order`,
                    success: false,
                });
            });
    },
);

//route to delete particular order
router.delete('/cancelorder/:id', verifyUser, (req, res) => {
    let _id = req.params.id;
    orderModel
        .deleteOne({ _id })
        .then(() =>
            res.status(200).send({ message: 'Order Canceled', success: true }),
        )
        .catch((err) => {
            console.log(err);
            res.status(400).send({
                message: 'Unable to cancel order',
                success: false,
            });
        });
});

// exporting router Object
module.exports = router;
