const express = require('express');
const router = express.Router();

//import middlewares
const checkAuth = require('../middlewares/check-auth')

//import database models
const Order = require('../models/order.js');
const Product = require('../models/product.js');

//import controlers
const OrdersController = require('../controllers/orders');

// Handle incoming requests 
router.get('/', checkAuth, OrdersController.orders_get_all);

router.get('/:orderId', checkAuth, OrdersController.orders_get_order);

router.post('/', checkAuth, OrdersController.orders_create_order);

//to delete all, create a route that calls  OrdersController.orders_delete_all
//router.delete('/delete-all', checkAuth, OrdersController.orders_delete_all);

router.delete('/:orderId', checkAuth, OrdersController.orders_delete_order);


module.exports = router;