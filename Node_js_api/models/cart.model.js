const mongoose = require('mongoose');

// Define the Cart schema
const cartSchema = mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true, 
        match: /^[0-9]*$/ 
    },
    category: { 
        type: String, 
        required: true 
    },
    quantity: { 
        type: Number, 
        required: true, 
        match: /^[0-9]*$/ 
    },
    sku: { 
        type: String, 
        required: true 
    },
    image: { 
        type: String, 
     },
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

// Export the Cart model
const cartData = mongoose.model('Cart', cartSchema);
module.exports = cartData;
