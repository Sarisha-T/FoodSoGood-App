//import package
const express=require ('express');
const dotenv=require("dotenv")
const cors=require('cors')
const db=require('./db')

//controllers
const user = require('./controllers/user');
const restaurant = require('./controllers/restaurant');
const foods = require('./controllers/food');
const order = require('./controllers/order');
const cart = require('./controllers/cart');

//configuration for environment variable
dotenv.config({path:"./config/.env"})

//database connection 
db();

// initialize port and express object
const port = process.env.PORT;
const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.get('/', (req, res) => res.send('Hey!! server is working'));
app.use('/user', user);
app.use('/restaurant', restaurant);
app.use('/food', foods);
app.use('/order', order);
app.use('/cart', cart);

// port
app.listen(port, () => console.log(`server running on port number ${port}`));

