const express = require('express');
const router = express.Router();
const cpnCrtl = require('../controllers/coupon.js');
const {createCouponSchema, updateCouponSchema}= require('../validations/coupon.js');
const {validate} = require ('../middleware/validate.js');


router.get('/',cpnCrtl.getAllCpns);
router.post('/',validate(createCouponSchema),cpnCrtl.createCpn);
router.get('/:id',cpnCrtl.getCpn);
router.patch('/:id',validate(updateCouponSchema),cpnCrtl.updateCpn);
router.delete('/:id',cpnCrtl.deleteCpn);

module.exports = router;