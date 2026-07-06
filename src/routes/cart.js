const express = require('express');
const router = express.Router();
const cartCrtl = require('../controllers/cart.js');
const {validate} = require ('../middleware/validate.js');
const {cartItemSchema,updatCatItem} = require('../validations/cartItem.js');
const {validateCoupon} = require ('../validations/coupon.js');
const {auth}= require('../middleware/auth.js');

// no one is allowed to enter those routes unless they are logged in
router.use(auth);

router.get('/',cartCrtl.getCart);
router.post('/',validate(cartItemSchema),cartCrtl.addToCart);
router.post('/coupon',validate(validateCoupon),cartCrtl.applyCoupon);
router.patch('/:id',validate(updatCatItem),cartCrtl.updateItem);
router.delete('/:id',cartCrtl.deleteItem);
module.exports= router;