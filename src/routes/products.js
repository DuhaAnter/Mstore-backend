const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/products.js');
const variantRoutes = require('../routes/variants.js');
const reviewRoutes = require('../routes/review.js');


router.get('/', productCtrl.getAllProducts);
router.get('/:id', productCtrl.getProductById);
router.post('/', productCtrl.createProduct);
router.put('/:id', productCtrl.updateProduct);
router.delete('/:id', productCtrl.deleteProduct);
//variants
router.use('/:id/variants', variantRoutes);
//reviews
router.use('/:id/reviews', reviewRoutes);
// get products in certain category
router.use('/category/:id', productCtrl.getProductsByCategory);

module.exports = router;