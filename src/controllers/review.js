const reviewService = require('../services/review.js');

const createReview = async (req, res) => {
    try {
        const userId = 'f472b9bf-8fb8-4f9a-9737-6314ffac538e';
        const reviewData = req.body;
        const result = await reviewService.createReview(userId, reviewData);
        if (result.error1) {
            return res.status(400).json({ message: result.error1 });
        }
        if (result.error2) {
            return res.status(404).json({ message: result.error2 });

        }
        return res.status(201).json({
            message: "Review submitted successfully.",
            data: result
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "failed to create review" })
    }
};
const getAllReviews = async (req, res) => {
    try {
        const { id } = req.params; // product id from parent route

        const result = await reviewService.getAllReviews(id);
        if (result.error) {
            return res.status(404).json({ message: result.error });
        }
        return res.status(200).json({
            message: "Review retrived successfully.",
            data: result
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "failed to get all reviews" })
    }
};
const updateReview = async (req, res) => {
    try {
        const { id } = req.params; // review id
        const userId = 'f472b9bf-8fb8-4f9a-9737-6314ffac538e';
        const reviewUpdateData = req.body;
        const result = await reviewService.updateReview(id,userId,reviewUpdateData);
        if (result.error1) {
            return res.status(404).json({ message: result.error1 });
        }
        if (result.error2) {
            return res.status(403).json({ message: result.error2 });

        }
        return res.status(200).json({
            message: "Review updated successfully.",
            data: result
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "failed to update review" })
    }
};
const deleteReview = async (req, res) => {
    try {
        const { id } = req.params; // review id
        const userId = 'f472b9bf-8fb8-4f9a-9737-6314ffac538e';
        const result = await reviewService.deleteReview(id,userId);
        if (result.error1) {
            return res.status(404).json({ message: result.error1 });
        }
        if (result.error2) {
            return res.status(403).json({ message: result.error2 });

        }
        return res.status(200).json({
            message: "Review deleted successfully.",
            data: result
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "failed to delete review" })
    }
};


module.exports = {
    createReview,
    getAllReviews,
    updateReview,
    deleteReview

}