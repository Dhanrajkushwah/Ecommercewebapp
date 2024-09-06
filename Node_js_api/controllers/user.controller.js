const manageUserModel = require("../models/user.model");
const manageCartModel = require("../models/cart.model");
const manageContactModel = require("../models/contact.model");
const manageCartdataModel = require("../models/cartdata.model");
const manageWishlistModel = require("../models/wishlist.model");

const status = require("../config/status");
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // Ensure the folder exists
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Name the file with timestamp
    }
});

const upload = multer({ storage: storage });

// Upload file and create cart
exports.uploadFile = async (req, res) => {
    upload.single('image')(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: 'File upload error', error: err });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { title, price, category, quantity, sku } = req.body;
        const imagePath = `/uploads/${req.file.filename}`; // Generate URL for image access

        const newCart = new manageCartModel({
            title,
            image: imagePath, // Save the image path in the database
            price,
            category,
            quantity,
            sku,
        });

        try {
            await newCart.save();
            res.json({ success: true, message: 'Image uploaded successfully', cart: newCart });
        } catch (err) {
            res.status(500).json({ message: 'Error saving cart to database', error: err });
        }
    });
};



// Get all users
exports.list = async (req, res) => {
    try {
        const data = await manageUserModel.find({}).lean().exec();
        return res.json({ data: data, success: true, status: status.OK });
    } catch (err) {
        console.error('Error fetching users:', err);
        return res.status(500).json({ success: false, status: status.INTERNAL_SERVER_ERROR, msg: 'Get Notes failed.' });
    }
};

// Register a new user
exports.registerUser = async (req, res) => {
    const { firstName, lastName, email, password, birthdate, gender, phoneNumber } = req.body;

    try {
        const userExists = await manageUserModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await manageUserModel.create({
            firstName,
            lastName,
            email,
            password,
            birthdate,
            gender,
            phoneNumber,
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            _id: user._id,
            email: user.email,
            token,
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create Cart with image upload
exports.createCart = [
    upload.single('image'), // Handle the image upload
    async (req, res) => {
        try {
            const { title, price, category, quantity, sku } = req.body;
            const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

            const newCart = new manageCartModel({
                title,
                price,
                category,
                quantity,
                sku,
                imageUrl
            });

            await newCart.save();
            res.json({ success: true, status: status.OK, msg: 'Adding Cart is successful.' });
        } catch (err) {
            console.log("Error creating cart:", err);
            return res.status(500).json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Adding Cart failed.' });
        }
    }
];

// Get all Cart
exports.listCart = async (req, res) => {
    try {
        const data = await manageCartModel.find({}).lean().exec();
        return res.json({ data: data, success: true, status: status.OK });
    } catch (err) {
        console.error('Error fetching carts:', err);
        return res.status(500).json({ success: false, status: status.INTERNAL_SERVER_ERROR, msg: 'Get carts failed.' });
    }
};

//Create Contact 
exports.createcontact = async (req, res) => {
    try {
        var obj = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            message: req.body.message,
        }
        const newmanageContactModel = new manageContactModel(obj);
        let result = await newmanageContactModel.save();
        res.json({ success: true, status: status.OK, msg: 'Adding Contact is successfully.' });

    }
    catch (err) {
        console.log("err", err)
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Adding Contact failed.' });

    }
}

// Get all Contact
exports.listContact = async (req, res) => {
    try {
        const data = await manageContactModel.find({}).lean().exec();
        return res.json({ data: data, success: true, status: status.OK });
    } catch (err) {
        console.error('Error fetching Contact:', err);
        return res.status(500).json({ success: false, status: status.INTERNAL_SERVER_ERROR, msg: 'Get Contact failed.' });
    }
};
// Login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await manageUserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            _id: user._id,
            email: user.email,
            token,
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add to Cart

exports.addToCart = async (req, res) => {
    console.log('Received data:', req.body);

    const { product } = req.body;

    // Validate the product data
    if (!product || !product.sku || !product.title || !product.price || !product.quantity || !product.imageUrl) {
        return res.status(400).json({ success: false, message: 'Incomplete product data' });
    }

    try {
        // Check if the cart exists for the current user or initialize a new one
        let cart = await manageCartdataModel.findOne();

        // If cart doesn't exist, create a new cart with the first product
        if (!cart) {
            cart = new manageCartdataModel({
                items: [product]
            });
        } else {
            // Cart exists, so add/update the product
            const existingProductIndex = cart.items.findIndex(item => item.sku === product.sku);

            if (existingProductIndex > -1) {
                // Product already in cart, update quantity and image URL
                cart.items[existingProductIndex].quantity += product.quantity;
                cart.items[existingProductIndex].imageUrl = product.imageUrl; // Update image URL if needed
            } else {
                // Product not in cart, add new product
                cart.items.push(product);
            }
        }

        // Save the updated cart
        await cart.save();
        res.json({ success: true, cart });

    } catch (err) {
        console.error('Error adding to cart:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};




exports.listacartdata = async (req, res) => {
    try {
        const data = await manageCartdataModel.find({}).lean().exec();
        return res.json({ data: data, success: true, status: status.OK });
    } catch (err) {
        console.error('Error fetching Cart:', err);
        return res.status(500).json({ success: false, status: status.INTERNAL_SERVER_ERROR, msg: 'Get Cart Data failed.' });
    }
};


// Delete product from cart
exports.deleteFromCart = async (req, res) => {
    const { sku } = req.params; // SKU is now coming from req.params

    // Validate that the SKU is provided
    if (!sku) {
        return res.status(400).json({ success: false, message: 'Product SKU is required' });
    }

    try {
        // Find the user's cart (assuming there's only one cart for simplicity)
        let cart = await manageCartdataModel.findOne();

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        // Find the index of the product to remove based on SKU
        const productIndex = cart.items.findIndex(item => item.sku === sku);

        if (productIndex === -1) {
            return res.status(404).json({ success: false, message: 'Product not found in cart' });
        }

        // Remove the product from the cart
        cart.items.splice(productIndex, 1);

        // Save the updated cart
        await cart.save();

        res.json({ success: true, message: 'Product removed from cart', cart });

    } catch (err) {
        console.error('Error removing product from cart:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};



// Add to Wishlist
exports.addToWishlist = async (req, res) => {
    console.log('Received data:', req.body);

    const { product } = req.body;

    // Validate the product data
    if (!product || !product.sku || !product.title || !product.price || !product.quantity || !product.imageUrl) {
        return res.status(400).json({ success: false, message: 'Incomplete product data' });
    }

    try {
        // Check if the wishlist exists for the current user or initialize a new one
        let wishlist = await manageWishlistModel.findOne();

        // If wishlist doesn't exist, create a new wishlist with the first product
        if (!wishlist) {
            wishlist = new manageWishlistModel({
                items: [product]
            });
        } else {
            // Wishlist exists, so add/update the product
            const existingProductIndex = wishlist.items.findIndex(item => item.sku === product.sku);

            if (existingProductIndex > -1) {
                // Product already in wishlist, update quantity and image URL
                wishlist.items[existingProductIndex].quantity += product.quantity;
                wishlist.items[existingProductIndex].imageUrl = product.imageUrl; // Update image URL if needed
            } else {
                // Product not in wishlist, add new product
                wishlist.items.push(product);
            }
        }

        // Save the updated wishlist
        await wishlist.save();
        res.json({ success: true, wishlist });

    } catch (err) {
        console.error('Error adding to wishlist:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


exports.listwishlist = async (req, res) => {
    try {
        const data = await manageWishlistModel.find({}).lean().exec();
        return res.json({ data: data, success: true, status: status.OK });
    } catch (err) {
        console.error('Error fetching Wishlist:', err);
        return res.status(500).json({ success: false, status: status.INTERNAL_SERVER_ERROR, msg: 'Get Wishlist Data failed.' });
    }
};

exports.deleteFromwishlist = async (req, res) => {
    const { sku } = req.params; // SKU is now coming from req.params

    // Validate that the SKU is provided
    if (!sku) {
        return res.status(400).json({ success: false, message: 'Product SKU is required' });
    }

    try {
        // Find the user's wishlist (assuming there's only one wishlist for simplicity)
        let wishlist = await manageWishlistModel.findOne();

        if (!wishlist) {
            return res.status(404).json({ success: false, message: 'Wishlist not found' });
        }

        // Find the index of the product to remove based on SKU
        const productIndex = wishlist.items.findIndex(item => item.sku === sku);

        if (productIndex === -1) {
            return res.status(404).json({ success: false, message: 'Product not found in wishlist' });
        }

        // Remove the product from the wishlist
        wishlist.items.splice(productIndex, 1);

        // Save the updated wishlist
        await wishlist.save();

        res.json({ success: true, message: 'Product removed from wishlist', wishlist }); // Update message to reflect wishlist

    } catch (err) {
        console.error('Error removing product from wishlist:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

