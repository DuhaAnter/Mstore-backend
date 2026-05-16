const express = require('express');
//here, you must pass an option called mergeParams: true. This tells Express: "Hey, let this router access the variables (like :productId) from the parent router."
const router = express.Router({ mergeParams: true });
const variantCtrl = require('../controllers/variants.js');
const {createVariantSchema, updateVariantSchema} = require('../validations/variant.js');
const {validate} = require ('../middleware/validate.js');
const {isVariantMine} = require('../middleware/variantToProduct.js');

router.post('/',validate(createVariantSchema),variantCtrl.createVariant);
router.get('/',variantCtrl.getAllVariants);
router.delete('/:variantId',isVariantMine(),variantCtrl.deleteVariant);
router.patch('/:variantId',validate(updateVariantSchema),isVariantMine(),variantCtrl.updateVariant);
router.get('/:variantId',isVariantMine(),variantCtrl.getVariantById);

module.exports = router;