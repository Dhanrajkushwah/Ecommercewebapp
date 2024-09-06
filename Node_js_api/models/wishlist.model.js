const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    items: [{
        sku: { type: String, required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        imageUrl: { type: String }
    }]
});

module.exports = mongoose.model('Wishlist', wishlistSchema);
