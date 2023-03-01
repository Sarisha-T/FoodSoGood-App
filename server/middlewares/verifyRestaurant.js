// middleware to check if its restaurant user
const verifyRestaurant = (req, res, next) => {
    let role = req.user.role;
    if (role == 'restaurant') {
        next();
    } else {
        res.status(400).send({
            message: 'not authorized',
            success: false,
        });
    }
};

// export middleware
module.exports = verifyRestaurant;
