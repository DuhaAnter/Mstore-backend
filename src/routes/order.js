const express = require('express');
const router = express.Router();
const orderCtrl = require ('../controllers/order.js');
const {auth} = require('../middleware/auth.js');

// no one is allowed to enter those routes unless they are logged in
router.use(auth);

router.post('/checkout',orderCtrl.checkout);
router.get('/', orderCtrl.getAllOrders);
router.get('/:id', orderCtrl.getOrder);
router.patch('/:id',orderCtrl.updateOrderStatus);

module.exports= router;
