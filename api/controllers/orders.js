const Order = require('../models/order.js');
const Product = require('../models/product.js');

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
    .select('payment products _id')   //comando para mostrar apenas esses campos 
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
                return  {
                    _id: doc._id,
                    products: doc.products,
                    payment: doc.payment,
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
    var products = req.body.products; 
    var promises = [];

    //validating Array or transformating json format to array format
    if(Array.isArray(products) == false){
        products = Object.values(products); //transforms object in array
    }

    for (let i = 0; i < products.length; i++) {
        var productId = products[i]["_id"];

        if (!mongoose.Types.ObjectId.isValid(productId)){
            products.splice(i,1);   //remove product with invalid id
        } 
        else {
            var p = Product.findById(productId)
                    .then(prod => {
                        if(prod == null){
                            products.splice(i,1);   //remove product with 'valid id' that isnt registered
                            return "removed";
                        }
                        return "product maintened";
                    })
                    .catch(err => {
                        res.status(500).json({
                            message: err
                        });
                    });
            promises.push(p);
        }
    }
    
    //vinculate products prices
    


    //save order
    Promise.all(promises).then(() => {
        //verify if exists at least 1 product
        if(products.length <= 0){
            return res.status(404).json({
                message: "product not found"
            }); 
        }

        //creating order and saving
        const order = new Order({
            _id: new mongoose.Types.ObjectId(), //string
            products: products,                 //[]
            payment: req.body.payment           //sting
        });
        order.save();
        
        return res.status(200).json({
            message: "order created",
            order: order
        });
    })
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