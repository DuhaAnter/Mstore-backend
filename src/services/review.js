const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createReview = async (userId, reviewData) => {
    //Check if the user already reviewed this product
    const existingReview = await prisma.review.findFirst({
        where: {
            productId: reviewData.productId,
            userId
        }
    });

    if (existingReview) {
        return {
            error1: "You have already reviewed this product. Please update your existing review instead."
        }
    }

    // Verify that the product actually exists 
    const product = await prisma.product.findUnique({
        where: { id: reviewData.productId }
    });

    if (!product) {
        return { error2: "Product not found." };
    }

    //finally Create the new review
    const newReview = await prisma.review.create({
        data: {
            userId,
            productId: reviewData.productId,
            starts: reviewData.starts,
            content: reviewData.content
        }
    });

    return newReview;
};
const getAllReviews = async(id)=>{
    //Verify the product exists
    const productExists = await prisma.product.findUnique({
      where: { id }
    });

    if (!productExists) {
      return { error: "Product not found" };
    }

    //Fetch all reviews for this specific product, including user metadata
    const reviews = await prisma.review.findMany({
      where: { productId :id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            
          }
        }
      },
      orderBy: {
        createdAt: 'desc' 
      }
    });

    return reviews;
};
const updateReview = async(id,userId,reviewUpdatedData)=>{
    //Find the review to verify existence and check ownership
    const review = await prisma.review.findUnique({
      where: { id }
    });

    if (!review) {
      return { error1: "Review not found" };
    }

    //Security Check: Does this review belong to the userId?
    if (review.userId !== userId) {
      return { 
        error2: "Access denied. this review isn't yours" 
      };
    }

    //Update 
    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        starts: reviewUpdatedData.starts,
        content: reviewUpdatedData.content
      }
    });

    return updatedReview;
};
const deleteReview = async(id,userId)=>{
    //Find the review first to verify existence and ownership
    const review = await prisma.review.findUnique({
      where: { id }
    });

    if (!review) {
      return { error1: "Review not found" };
    }

    //Security Check: Does this review belong to the logged-in user?
    if (review.userId !== userId) {
      return { 
        error2: "Access denied. You can only delete reviews that you created." 
      };
    }

    //Delete
   const deletedReview = await prisma.review.delete({
      where: { id }
    });

    return deletedReview;
};

module.exports = {
    createReview,
    getAllReviews,
    updateReview,
    deleteReview
}