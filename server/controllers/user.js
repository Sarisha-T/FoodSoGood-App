//import packages
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//import mongoDB models
const userModel = require('../models/userModel');
const orderModel = require('../models/orderModel');
const cartMOdel = require('../models/cartModel');

//import middlewares
const verifyUser = require('../middlewares/verifyUser');

//initialize router obj
const router = express.Router();

// route to register user
router.post('/register', async (req, res) => {
    let userData = req.body;

    let salt = await bcrypt.genSalt(10);

    let hashedPassword = await bcrypt.hash(userData.password, salt);

    userData.password = hashedPassword;

    const users = userModel(userData);

    users
        .save()
        .then(() =>
            res
                .status(200)
                .send({ message: 'User Created!!', success: true }),
        )
        .catch((err) => {
            console.log(err);
            res.status(400).send({
                message: 'user already exists, enter new email',
                success: false,
            });
        });
});

// route to login user
router.post('/login', async (req, res) => {
    let userCred = req.body;

    let user = await userModel.findOne({
        role: userCred.role,
        username: userCred.username,
    });

    if (user === null) {
        res.status(401).send({
            massage: 'Unable to find user',
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
                message: 'Invalid password',
                success: false,
            });
        }
    }
});

//route to update user details
router.put('/update/:id', verifyUser, (req, res) => {
    let _id = req.params.id;
    let updatedData = req.body;
    userModel
        .updateOne({ _id }, updatedData)
        .then(() =>
            res.status(200).send({ message: 'User Updated', success: true }),
        )
        .catch((err) => {
            console.log(err);
            res.status(400).send({
                message: 'Unable to update user',
                success: false,
            });
        });
});

//get orders by that user
router.get('/orders/:id', verifyUser, async (req, res) => {
    let userid = req.params.id;
    const orders = await orderModel
        .find({ user: userid })
        .populate('user')
        .populate('restaurant')
        .populate('food');

    res.status(200).send(orders);
});

//get cart data of that user
router.get('/cart/:id', async (req, res) => {
    let userid = req.params.id;

    let cartItems = await cartMOdel
        .find({ user: userid })
        .populate('food')
        .populate('user');

    res.status(200).send(cartItems);
});

//export router obj
module.exports = router;
