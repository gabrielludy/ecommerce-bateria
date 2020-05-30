const Order = require('../models/order.js');
const Product = require('../models/product.js');
const User = require('../models/user.js');
var jwt = require('jsonwebtoken');

//import database models
const mongoose = require('mongoose');

exports.orders_delete_all = (req, res, next) => {
    Order.deleteMany({}, function(err, result) {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      });
}


exports.orders_get_all = (req, res, next) => {
    Order.find()
    .select('_id products payment totalPrice user')   //comando para mostrar apenas esses campos 
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
                return  {
                    _id: doc._id,
                    products: doc.products,
                    payment: doc.payment,
                    totalPrice: doc.totalPrice,
                    user: doc.user
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

exports.orders_create_order = async (req, res, next) => {
    var products = req.body.order.products; 
    var userInformation = {
        'email': req.userData.email,
        'userId': req.userData.userId
    };
    var promises = [];


    //verify the ids and remove invalid products
    Object.keys(products).forEach(function(productId) {
        if (!mongoose.Types.ObjectId.isValid(productId)){
            delete products[productId];   //remove product with invalid id
        } 
        else {
            let p = Product.findById(productId)
                    .then(prod => {
                        if(prod == null){
                            delete products[productId];    //remove product with 'valid id' that isnt registered
                            return "product removed";
                        }
                        
                        products[productId]["price"] = prod["price"];  //adding price
                        products[productId]["name"] = prod["name"];  //adding name
                        return "product maintened and price added";
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        })
                    });
            promises.push(p);
        }
    });

    
    try{
        await Promise.all(promises);

        //calculate total price
        var totalPrice = 0;
        Object.keys(products).forEach(function(productId) {
            totalPrice += products[productId]["price"];
        });

        //creating order and saving
        const order = new Order({
            _id: new mongoose.Types.ObjectId(), //string
            products: products,                 //[]
            payment: req.body.payment,           //sting
            totalPrice: totalPrice,
            user: userInformation
        });
        order.save();

        return res.status(200).json({
            message: "order created",
            order: order
        });

    } catch {
        err => {
            return res.status(500).json({
                error: err
            })
        }
    }
}

exports.orders_delete_order =  (req, res, next) => {
    Order.remove({ _id: req.params.orderId })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'order deleted',
            request: {
                type: 'POST',
                url: '/orders/',
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