const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference the User model
    productId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }] // Array of product IDs
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
