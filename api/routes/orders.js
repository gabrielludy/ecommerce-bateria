const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middlewares/check-auth')


const Order = require('../models/order.js');
const Product = require('../models/product.js');
const Ordem = require('../models/order.js');

// Handle incoming GET requests to /orders
router.get('/', checkAuth, (req, res, next) => {
    Order
        .find()
        .select('quantity product _id')   //comando para mostrar apenas esses campos 
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return  {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        reques: {
                            type: 'GET',
                            url: 'http://localhost:3000/order/' + doc._id 
                        }
                    }
                })
            });
        })
        .catch();
});

router.get('/:orderId', checkAuth, (req, res, next) => {
    Order.findById(req.params.orderId)
    .exec()
    .then(order => {
        if (!order) {
            return res.status(404).json({ 
                message: 'Order not found'
            });
        }

        res.status(200).json({
            order: order,
            resquest: {
                type: 'GET',
                url: 'http://localhost:3000/orders'
            }
        });
    })
});

router.post('/', checkAuth, (req, res, next) => {
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        product: req.body.product,
        quantity: req.body.quantity
    });
    
    const product = Product
    .findById(req.body.product)
    .then(product => {
        if (!product) {
            return res.status(404).json({
                message: "product not found"
            });
        }
    
        return order.save();
    })
    .then(result => {
        console.log(order);
        res.status(201).json({
            message: 'order created',
            order: result,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders/'+result._id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'order create error',
            error: err
        })
    });   
});

router.post('/:orderId', checkAuth, (req, res, next) => {
    Order.findById(req.params.orderId)
    .exec()
    .then(order => {
        res.status(200).json({
            order: order,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders/' + order._id
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:orderId', checkAuth, (req, res, next) => {
    Order.remove({ _id: req.params.orderId })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'order deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/orders/',
                body: {
                    productId: 'ID',
                    quantity: 'Number'
                }
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });
});

module.exports = router;