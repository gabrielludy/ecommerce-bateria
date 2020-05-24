const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    products: { type: Array, required: true },
    payment: {type: String, default: "credit card"},
    user: {type: Object, required: true},
    totalPrice: {type: Number, required: true}
});

module.exports = mongoose.model('Order', orderSchema);