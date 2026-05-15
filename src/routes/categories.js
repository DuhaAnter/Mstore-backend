const express = require('express');
const router = express.Router();

const catCtrl = require('../controllers/categories.js');
const { validate } = require('../middleware/validate.js');
const { createCateSchema, updateCateSchema, linkCateSubCateSchema } = require('../validations/category.validation.js');

// 1. Standard CRUD Operations
router.get('/', catCtrl.getAllCates);
router.post('/', validate(createCateSchema), catCtrl.createCate);

// 2. Sub-resource Relationships (Place specific/sub-routes logically)
router.post('/linksubcategory', validate(linkCateSubCateSchema), catCtrl.linkSubCate);
router.get('/:id/subcategories', catCtrl.getSubCatesByCateID); 

// 3. Parameterized IDs (Keep these towards the bottom)
router.get('/:id', catCtrl.getCateById);
router.delete('/:id', catCtrl.deleteCate);
router.patch('/:id', validate(updateCateSchema), catCtrl.updateCate);

module.exports = router;