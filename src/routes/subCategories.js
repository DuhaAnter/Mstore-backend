const express = require('express');
const router = express.Router();

const subCatCtrl = require('../controllers/subCategories.js');
const { validate } = require('../middleware/validate.js');
const { createCateSchema,updateCateSchema } = require('../validations/category.validation.js');



router.get('/',subCatCtrl.getAllSubCates);
router.get('/:id', subCatCtrl.getSubCateById);
router.post('/',validate(createCateSchema),subCatCtrl.createSubCate);
router.delete('/:id', subCatCtrl.deleteSubCate);
router.patch('/:id', validate(updateCateSchema), subCatCtrl.updateSubCate);

module.exports = router;

