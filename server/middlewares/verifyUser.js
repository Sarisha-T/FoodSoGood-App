//import packages
const jwt = require('jsonwebtoken');

// middleware to verify the user with token
const verifyUser = async (req, res, next) => {
    if (req.headers.authorization !== undefined) {
        let token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, 'code', (err, userCred) => {
            if (err === null) {
                req.user = userCred;
                next();
            } else {
                console.log(err);
                res.send('invalid token');
            }
        });
    } else {
        res.status(403).send({ message: 'Please Authicate' });
    }
};

// exporting middlewares
module.exports = verifyUser;
