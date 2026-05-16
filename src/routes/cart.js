const express = require('express');
const router = express.Router();
const cartCrtl = require('../controllers/cart.js');
const {validate} = require ('../middleware/validate.js');
const {cartItemSchema} = require('../validations/cartItem.js');

router.get('/',cartCrtl.getCart);
router.post('/',validate(cartItemSchema),cartCrtl.addToCart);
router.patch('/:id',cartCrtl.updateItem);
router.delete('/:id',cartCrtl.deleteItem);
module.exports= router;