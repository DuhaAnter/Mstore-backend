const express = require('express');
const router = express.Router();
const cpnCrtl = require('../controllers/coupon.js');

router.get('/',cpnCrtl.getAllCpns);
router.post('/',cpnCrtl.createCpn);
router.get('/:id',cpnCrtl.getCpn);
router.patch('/:id',cpnCrtl.updateCpn);
router.delete('/:id',cpnCrtl.deleteCpn);

module.exports = router;