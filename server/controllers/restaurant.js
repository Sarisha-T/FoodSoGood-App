//import packages
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const formidable = require('formidable');
const fs = require('fs');

// importing mongoDB Models
const restaurantModel = require('../models/restaurantModel');
const foodModel = require('../models/foodModel');
const orderModel = require('../models/orderModel');

// importing middlewares
const verifyUser = require('../middlewares/verifyUser');
const verifyRestaurant = require('../middlewares/verifyRestaurant');

// initializing router Object
const router = express.Router();

// route to create restaurant
router.post('/register', (req, res) => {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {

        if (err === null) {
            let oldpath = files.image.filepath;

            let newImageName =
                files.image.newFilename +
                '.' +
                files.image.originalFilename.split('.')[1];

            console.log(newImageName);

            let newpath = './images/restaurant/' + newImageName;
            console.log(newpath);

            fs.readFile(oldpath, (err, data) => {
                if (err === null) {
                    fs.writeFile(newpath, data, (err) => {
                        if (err === null) {
                            fs.unlink(oldpath, async (err) => {
                                if (err === null) {
                                    let userData = fields;

                                    userData.image = newImageName;

                                    let salt = await bcrypt.genSalt(10);

                                    let hashedPassword = await bcrypt.hash(
                                        userData.password,
                                        salt,
                                    );

                                    userData.password = hashedPassword;

                                    const restaurants =
                                        restaurantModel(userData);

                                    restaurants
                                        .save()
                                        .then(() =>
                                            res.status(200).send({
                                                message:
                                                    'Restaurant account created!!',
                                                success: true,
                                            }),
                                        )
                                        .catch((err) => {
                                            console.log(err);
                                            res.status(400).send({
                                                message:
                                                    'Restaurant name already exists',
                                                success: false,
                                            });
                                        });
                                } else {
                                    console.log(err);
                                    res.status(400).send({
                                        message: 'Unable to create Restaurant',
                                        success: false,
                                    });
                                }
                            });
                        } else {
                            console.log(err);
                            res.send({
                                message: 'Unable to create Restaurant',
                                success: false,
                            });
                        }
                    });
                } else {
                    console.log(err);
                    res.status(400).send({
                        message: 'Unable to create Restaurant',
                        success: false,
                    });
                }
            });
        }
    });
});

// route to get the image of the restaurant
router.get('/image/:filename', (req, res) =>
    res.download('./images/restaurant/' + req.params.filename),
);

// route to login the restaurant admin
router.post('/login', async (req, res) => {
    let userCred = req.body;

    let user = await restaurantModel.findOne({
        role: userCred.role,
        restaurantName: userCred.restaurantName,
    });

    console.log(user);

    if (user === null) {
        res.status(401).send({
            message: 'Unable to find user',
            success: false,
        });
    } else {
        const passwordStatus = await bcrypt.compare(
            userCred.password,
            user.password,
        );
        if (passwordStatus) {
            const token = await jwt.sign(userCred, 'code');
            res.status(200).send({ user, token, success: true });
        } else {
            res.status(401).send({
                message: 'Invalid Password',
                success: false,
            });
        }
    }
});

// route to get all the restaurants
router.get('/get', async (req, res) => {
    const restaurants = await restaurantModel.find();
    res.send(restaurants);
});

// route to get the signal restaurant
router.get('/get/:id', verifyUser, async (req, res) => {
    let _id = req.params.id;
    const restaurant = await restaurantModel.findOne({ _id });
    let foods = await foodModel
        .find({ restaurant: restaurant._id })
        .populate('restaurant');

    res.send({ restaurant, foods });
});

// route to get the orders came to the restaurant
router.get('/orders/:id', verifyUser, verifyRestaurant, async (req, res) => {
    let restaurantid = req.params.id;

    const orders = await orderModel
        .find({ restaurant: restaurantid })
        .populate('user')
        .populate('food')
        .populate('restaurant');

    // console.log(orders);

    res.status(200).send(orders);
});

// route to get the all the food items created by restaurant
router.get('/foods/:id', verifyUser, async (req, res) => {
    const foods = await foodModel.find({ restaurant: req.params.id });
    res.status(200).send(foods);
});

// exporting router Object
module.exports = router;
