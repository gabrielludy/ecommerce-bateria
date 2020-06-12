const express = require('express');
const app = express();
const morgan = require('morgan');   //para mostrar logs
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

mongoose.connect(
    'mongodb+srv://gabrielluizferraz:' + 
    process.env.MONGO_ATLAS_PW + 
    '@loja-bateria-wuycb.gcp.mongodb.net/test?retryWrites=true&w=majority',
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true 
    });

// used for image upload
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit: '5mb'}));

//used for avoid CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    req.header(
        "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization"  
    );
    if(req.method === "OPTIONS") {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE, GET, PATCH');
        return res.status(200).json({});
    }
    next();
})

//API Routes with should handle requests
//app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

//Webapp routes
app.use('/public', express.static(__dirname + '/public'));  //serving all files in /public staticaly
app.get('/', function(req, res) {
    console.log('GET in ' + __dirname + '/public/index.html');
    res.status(200).sendFile(__dirname + '/public/index.html');
});
app.use('/orders', function(req, res) {
    res.status(200).sendFile(__dirname + '/public/assets/orders.html');
});
app.use('/user', function(req, res) {
    res.status(200).sendFile(__dirname + '/public/assets/user.html');
});
app.use('/products', function(req, res) {
    res.status(200).sendFile(__dirname + '/public/assets/products.html');
});
app.use('/product/:productId', function(req, res) {
    res.status(200).sendFile(__dirname + '/public/assets/product.html');
});
app.use('/cart', function(req, res) {
    res.status(200).sendFile(__dirname + '/public/assets/cart.html');
});
app.use('/checkout', function(req, res) {
    res.status(200).sendFile(__dirname + '/public/assets/checkout.html');
});
app.use('/thankyou', function(req, res) {
    res.status(200).sendFile(__dirname + '/public/assets/thankyou.html');
});


//error handling
app.use((req, res, next) => {
    const error = new Error('Not Found.');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
       error: {
            message: error.message
        }
    });
});


module.exports = app;


