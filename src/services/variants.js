const { PrismaClient } = require('@prisma/client');
const { getProductById } = require('../controllers/products');
const prisma = new PrismaClient();


const getAllVariants = async (id) => {
    //Hitting the database twice (findUnique for the product, then findMany for the variants) adds unnecessary overhead. Instead, you can use Prisma's relationships to get both pieces of information in a single database call.
    //Instead of querying the Variant table directly, query the Product table by its ID and include its variants.
    const result = await prisma.product.findUnique({
        where: { id },
        include: {
            variants: true
        }
    })
    if (result) {
        return result.variants;
    }
    return { error: "product not found" };
};
const createVariant = async (id, variant) => {
    const { size, price, color } = variant;
    const productExist = await prisma.product.findUnique({ where: { id } });
    if (!productExist) {
        return { error1: "this product does not exist" }
    }
    const variantExist = await prisma.variant.findFirst({
        where: {
            productId: { equals: id },
            size: { equals: size },
            color: { equals: color },
        }
    })
    if (variantExist) {
        return { error2: "A variant with this size and color already exists for this product" }
    }
    const newVariant = await prisma.variant.create({
        data: {
            size,
            color,
            price,
            productId: id
        }
    })
    return newVariant;
};
const deleteVariant = async (id) => {
    const deletedVariant = await prisma.variant.delete({
        where: { id }
    })
    return deletedVariant;
};
const updateVariant = async (id, oldVariant, updatedVariantData) => {
    // Extract the incoming partial updates 
    const { size, color , price , stock } = updatedVariantData;
    // Duplicate Prevention Logic
    // We only need to check for duplicates if the client is changing the size OR the color


    // Determine what the final state WOULD look like by merging incoming data with old data
    const targetSize = size !== undefined ? size : oldVariant.size;
    const targetColor = color !== undefined ? color : oldVariant.color;

    // Query the database to see if ANOTHER variant already uses this exact combination
    const duplicateExists = await prisma.variant.findFirst({
        where: {
            productId: oldVariant.productId,
            size: targetSize,
            color: targetColor,
            NOT: {
                id: oldVariant.id // Exclude our current variant from the search
            }
        }
    });


    if (duplicateExists) {
        return { error: `A variant with Size: '${targetSize}' and Color: '${targetColor}' already exists for this product` }





    }
    const updatedVariant = await prisma.variant.update({
        where: { id: oldVariant.id },
        data: {
            size,
            color,
            price,
            stock
        }
    });
    return updatedVariant;
};
const getVariantById = async (id)=>{
    const variant = await prisma.variant.findUnique({
        where:{id}
    })
    return variant;
};
module.exports = {
    getAllVariants,
    createVariant,
    deleteVariant,
    updateVariant,
    getVariantById
}