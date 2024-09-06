const express = require("express");
const userController = require("../controllers/user.controller");
const router = express.Router();

router.route('/list')
    .get(userController.list)
router.route('/signup')
    .post(userController.registerUser)
router.route('/login')
    .post(userController.loginUser)
router.route('/create')
    .post(userController.createCart)
router.route('/listcart')
    .get(userController.listCart)
router.route('/upload')
    .post(userController.uploadFile)
router.route('/contact')
    .post(userController.createcontact)
router.route('/listcontact')
    .get(userController.listContact)

router.route('/addtocart')
    .post(userController.addToCart)
router.route('/addtowishlist')
    .post(userController.addToWishlist)
router.route('/deletecart/:sku')
    .delete(userController.deleteFromCart)

router.route('/listcartdata')
    .get(userController.listacartdata)
router.route('/listwishlist')
    .get(userController.listwishlist)
    
router.route('/deletewish/:sku')
    .delete(userController.deleteFromwishlist);

module.exports = router;
