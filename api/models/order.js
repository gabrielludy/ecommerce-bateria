const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    products: { type: Array, required: true },
    payment: {type: String, default: "credit card"},
    shipping: {type: String, default: "normal"},
    user: {type: Object, required: true},
    totalPrice: {type: Number, required: true}
});

module.exports = mongoose.model('Order', orderSchema);