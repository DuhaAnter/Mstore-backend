const express = require('express');
const router = express.Router();
const orderCtrl = require ('../controllers/order.js');
const {auth, restrictTo} = require('../middleware/auth.js');
const { validate } = require('../middleware/validate.js');
const { createOrderSchema } = require('../validations/order.js');

// no one is allowed to enter those routes unless they are logged in
router.use(auth);

router.post('/',validate(createOrderSchema),orderCtrl.createOrder);
router.get('/',restrictTo('ADMIN'), orderCtrl.getAllOrders);
router.get('/me', orderCtrl.getAllOrdersForCertainUser);
router.get('/:id', orderCtrl.getOrder);
router.patch('/:id',orderCtrl.updateOrderStatus);

module.exports= router;
