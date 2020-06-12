const express = require('express');
const router = express.Router();
var jwt = require('jsonwebtoken');


//import middlewares
const checkAuth = require('../middlewares/check-auth');
const checkAuthAdmin = require('../middlewares/check-auth-admin');

//import controlers
const OrdersController = require('../controllers/orders');

// Handle incoming requests 
router.get('/all', checkAuthAdmin, OrdersController.orders_get_all);

router.get('/', checkAuth, OrdersController.orders_my_orders);

//router.get('/:orderId', checkAuth, OrdersController.orders_get_order);

router.post('/', checkAuth, OrdersController.orders_create_order);

router.delete('/:orderId', checkAuthAdmin, OrdersController.orders_delete_order);

router.delete('/delete-all', CheckAuthAdmin, OrdersController.orders_delete_all);


module.exports = router;