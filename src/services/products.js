const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();


const getAllProducts = async () => {
    const products = await prisma.product.findMany({
        include: {
            variants: true
        }
    });

    const productsWithPrices = products.map((product) => {
        if (product.variants && product.variants.length > 0) {
            const prices = product.variants.map(variant => variant.price);
            const minPrice = Math.min(...prices);
            return {
                ...product,
                minPrice: minPrice
            }
        }//end of if

        //if no variants
        return{
            ...product,
            minPrice:0
        }
    })//end of first map
    return productsWithPrices;

};

const getProductById = async (id) => {
    const product = await prisma.product.findUnique({
        where:
        {
            id: id
        }
    });
    return product;
};

const deleteProduct = async (id) => {
    await prisma.variant.deleteMany({
        where: { productId: id }
    });
    const deletedProduct = await prisma.product.delete({
        where:
        {
            id: id
        }
    })
    return deletedProduct;
};

const updateProduct = async (id, updatedData) => {


    const updatedProduct = await prisma.product.update({
        where:
        {
            id: id,

        },
        data: updatedData
    })
    return (updatedProduct);
};

const createProduct = async (product) => {

    const createdProduct = await prisma.product.create({
        data: product
    })
    return (createdProduct);
};


module.exports = {
    getAllProducts,
    getProductById,
    deleteProduct,
    updateProduct,
    createProduct
}