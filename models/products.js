const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, required: true },
    productImage: { type: String, required: true }
});

const Products = mongoose.model('Products', productSchema);
module.exports = Products;
