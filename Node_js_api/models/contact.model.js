const mongoose = require('mongoose');
const contactSchema = mongoose.Schema({
    name: {
        type: String,
    },
    email: { type: String, unique: true, required: true },
    phone: {
        type: String,
        required: true,
        minlength: 10,  
        maxlength: 12    
    },
    message: {
        type: String,
    }


},
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
    });
const ContactData = mongoose.model('contact', contactSchema);
module.exports = ContactData;





