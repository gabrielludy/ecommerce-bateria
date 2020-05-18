const Order = require('../models/order.js');
const Product = require('../models/product.js');

//import database models
const mongoose = require('mongoose');


exports.orders_get_all = (req, res, next) => {
    Order.find()
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
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}

exports.orders_get_order = (req, res, next) => {
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
    .catch(err => {
        res.status(500).json({
            error: err
        });
    })
}

exports.orders_create_order = (req, res, next) => {
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        product: req.body.product,
        quantity: req.body.quantity
    });
    
    const product = Product.findById(req.body.product)
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
}

exports.orders_delete_order = (req, res, next) => {
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
}