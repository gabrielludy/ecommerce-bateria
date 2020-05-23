const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    products: { type: Array, required: true },
    payment: {type: String, default: "credit card"}
});

module.exports = mongoose.model('Order', orderSchema);