const express = require('express');
const router = express.Router();
const orderCtrl = require ('../controllers/order.js');

router.post('/checkout',orderCtrl.checkout);
router.get('/', orderCtrl.getAllOrders);
router.get('/:id', orderCtrl.getOrder);
router.patch('/:id',orderCtrl.updateOrderStatus);

module.exports= router;
