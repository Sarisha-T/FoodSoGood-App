//import packages
const express = require('express');
const formidable = require('formidable');
const fs = require('fs');

//import middlewares
const verifyUser = require('../middlewares/verifyUser');
const verifyRestaurant = require('../middlewares/verifyRestaurant');
const verifyFood =
    require('../middlewares/verifyFood').verifyFood;

//import mongoDB models
const foodModel = require('../models/foodModel');
const orderModel = require('../models/orderModel');
const cartModel = require('../models/cartModel');

//initialize router obj
const router = express.Router();

//route to add new food
router.post('/addFood', verifyUser,verifyRestaurant, (req, res) => {
    const form = new formidable.IncomingForm();

    form.parse(req, (err, feilds, files) => {
        if (err === null) {
            let oldpath = files.image.filepath;

            let newImagename =
                files.image.newFilename +
                '.' +
                files.image.originalFilename.split('.')[1];

            let newpath = './images/food/' + newImagename;

            fs.readFile(oldpath, (err, data) => {
                if (err === null) {
                    fs.writeFile(newpath, data, (err) => {
                        if (err === null) {
                            console.log('File stored');
                            fs.unlink(oldpath, (err) => {
                                if (err === null) {
                                    let foodData = feilds;

                                    foodData.image = newImagename;

                                    const foods = new foodModel(foodData);
                                    foods
                                        .save()
                                        .then((response) =>
                                            res.status(200).send({
                                                food: response,
                                                message: 'Food Item Created',
                                                success: true,
                                            }),
                                        )
                                        .catch((err) => {
                                            console.log(err);
                                            res.status(400).send({
                                                message:
                                                    'Unable to Create Food Item',
                                                success: false,
                                            });
                                        });
                                } else {
                                    console.log(err);
                                    res.status(400).send({
                                        message: 'unable to create file',
                                    });
                                }
                            });
                        } else {
                            console.log(err);
                            res.status(400).send({
                                message: 'unable to create file',
                            });
                        }
                    });
                } else {
                    console.log(err);
                    res.status(400).send({
                        message: 'Unable to Create food item',
                        success: false,
                    });
                }
            });
        } else {
            console.log(err);
            res.status(500).send({
                message: 'Unable to Create Food Item',
                success: false,
            });
        }
    });
});

//get image of food
router.get('/image/:filename', (req, res) => {
    res.download('./images/food/' + req.params.filename);
});

//update food details
router.put(
    '/updateFood/:id',
    verifyUser,
    verifyRestaurant,
    verifyFood,
    (req, res) => {
        let updatedData = req.body;
        let _id = req.params.id;

        foodModel
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
                    message: 'Unable to update food items',
                    success: false,
                });
            });
    },
);

//update food image

router.put(
    '/updateFoodImage/:id',
    verifyUser,
    verifyRestaurant,
    verifyFood,
    (req, res) => {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err === null) {
                console.log('req came');
                const food = await foodModel.findOne({
                    _id: req.params.id,
                });
                let oldFilePath = `./images/food/${food.image}`;

                let oldpath = files.image.filepath;

                let newImagename =
                    files.image.newFilename +
                    '.' +
                    files.image.originalFilename.split('.')[1];

                let newpath = './images/food/' + newImagename;

                fs.readFile(oldpath, (err, data) => {
                    if (err === null) {
                        fs.writeFile(newpath, data, (err) => {
                            if (err === null) {
                                console.log('File stored');

                                fs.unlink(oldpath, (err) => {
                                    if (err === null) {
                                        console.log('file saved');
                                        fs.unlink(oldFilePath, (err) => {
                                            if (err === null) {
                                                console.log('file removed');
                                                foodModel
                                                    .updateOne(
                                                        { _id: req.params.id },
                                                        { image: newImagename },
                                                    )
                                                    .then(() => {
                                                        console.log(
                                                            'data updated',
                                                        );
                                                        res.status(200).send({
                                                            fileName:
                                                                newImagename,
                                                            message:
                                                                'Food Item Created',
                                                            success: true,
                                                        });
                                                    })
                                                    .catch((err) => {
                                                        console.log(err);
                                                        res.status(400).send({
                                                            message:
                                                                'Unable to Create food item',
                                                            success: false,
                                                        });
                                                    });
                                            } else {
                                                console.log(err);
                                                res.status(400).send({
                                                    message:
                                                        'Unable to Create food item',
                                                    success: false,
                                                });
                                            }
                                        });
                                    } else {
                                        console.log(err);
                                        res.status(400).send({
                                            message: 'unable to create file',
                                        });
                                    }
                                });
                            } else {
                                console.log(err);
                                res.status(400).send({
                                    message: 'unable to create file',
                                });
                            }
                        });
                    } else {
                        console.log(err);
                        res.status(400).send({
                            message: 'Unable to Create food item',
                            success: false,
                        });
                    }
                });
            } else {
                console.log(err);
                res.status(500).send({
                    message: 'Unable to update image Food Item',
                    success: false,
                });
            }
        });
    },
);

// route to delete food
router.delete(
    '/deleteFood/:id',
    verifyUser,
    verifyRestaurant,
    verifyFood,
    async (req, res) => {
        let _id = req.params.id;

        const orders = await orderModel.find({ food: _id });
        const cartItems = await cartModel.find({ food: _id });

        foodModel
            .deleteOne({ _id })
            .then(() => {
                if (orders.length !== 0)
                    orders.map((order) => {
                        orderModel
                            .deleteOne({ _id: order._id })
                            .then(() => null)
                            .catch((err) => {
                                console.log(err);
                                res.status(400).send({
                                    message: 'Unable to delete',
                                    success: false,
                                });
                            });
                    });

                if (cartItems.length !== 0) {
                    cartItems.map((cartItem) => {
                        cartModel
                            .deleteOne({ _id: cartItem._id })
                            .then(() => null)
                            .catch((err) => {
                                console.log(err);
                                res.status(400).send({
                                    message: 'Unable to delete',
                                    success: false,
                                });
                            });
                    });
                }

                res.status(200).send({
                    message: 'Food Item deleted!!',
                    success: true,
                });
            })
            .catch((err) => {
                console.log(err);
                res.status(400).send({
                    message: 'Unable to delete',
                    success: false,
                });
            });
    },
);

// route to get all the food items
router.get('/getFood', async (req, res) => {
    const foods = await foodModel.find().populate('restaurant');

    res.send(foods);
});

// // route to get particular food
// router.get('/getFood/:name', verifyUser, async (req, res) => {
//     let name = req.params.name;
//     const foods = await foodModel.findOne({ name }).populate('restaurant');
//     res.status(200).send(foods);
// });

// export router obj
module.exports = router;
