const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewCtrl = require('../controllers/review.js');

router.post('/',reviewCtrl.createReview);
router.get('/',reviewCtrl.getAllReviews);
router.patch('/:id',reviewCtrl.updateReview);
router.delete('/:id',reviewCtrl.deleteReview);

module.exports= router;