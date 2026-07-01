const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const addToCart = async (userId, item) => {
    // Check if this user has a cart
    const cart = await prisma.cart.findUnique({
        where: { userId },
        select: { id: true }
    });

    let cartId;

    if (!cart) {
        const newCart = await prisma.cart.create({
            data: { userId }
        });
        cartId = newCart.id;
    } else {
        cartId = cart.id;
    }

    //Check if the cart has the item sent
    const itemExistInCart = await prisma.cartItem.findFirst({
        where: {
            cartId: cartId,
            variantId: item.variantId
        }
    });

    if (itemExistInCart) {
        console.log('old quantity:', itemExistInCart.quantity)
        console.log('new quantity:', item.quantity)
        //tell Prisma to update the quantity in the database
        const a7a = await prisma.cartItem.update({
            where: { id: itemExistInCart.id },
            data: {
                quantity: itemExistInCart.quantity + (item.quantity || 1)
            }
        });
        console.log('total', a7a.quantity)
        return await prisma.cart.findUnique({
            where: { id: cartId },
            include: {
                items: {
                    omit: {
                        cartId: true,
                        id: true,
                        variantId: true
                    }
                }
            }
        });

    } else {
        //it's new item , add (create) it
        const newItemAdded = await prisma.cartItem.create({
            data: {
                ...item,
                cartId: cartId
            }
        });

        return await prisma.cart.findUnique({
            where: { id: cartId },
            include: {
                items: {
                    omit: {
                        cartId: true,
                        id: true,
                        variantId: true
                    }
                }
            }
        });
    }
};
const getCart = async (userId) => {
    //we need to design a query that does a lot of heavy lifting.
    const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
            items: {
                include: {
                    variant: {
                        include: {
                            product: true
                        }
                    }
                }
            }
        }
    })
    return cart.items;
};
const updateItem = async (userId, itemId, updatedItemData) => {
    const cartItem = await prisma.cartItem.findUnique({
        where: { id: itemId },
        include: {
            cart: true,
            variant: true
        }
    });

    if (!cartItem) {
        return { status: "NOT_FOUND" }
    }

    if (cartItem.cart.userId !== userId) {
        return { status: "FORBIDDEN" }
    }

    if (updatedItemData.quantity > 0 && cartItem.variant.stock >= updatedItemData.quantity) {
        const updatedItem = await prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity: updatedItemData.quantity }
        });
        return { status: "success", messsage: "item updated" };
    } else if (updatedItemData.quantity == 0) {
        const deletedItem = await deleteItem(userId, itemId);
        return { status: "success", messsage: "item deleted" };
    } else if (cartItem.variant.stock < updatedItemData.quantity) {
        return { insufficientStock: true }
    }



};
const deleteItem = async (userId, itemId) => {
    const cartItem = await prisma.cartItem.findUnique({
        where: { id: itemId },
        include: {
            cart: true
        }
    });

    if (!cartItem) {
        return { error1: "Cart item not found" }
    }

    if (cartItem.cart.userId !== userId) {
        return { error2: "Not authorized to delete this cart item" }
    }

    const deletedItem = await prisma.cartItem.delete({
        where: { id: itemId }
    });

    return deletedItem;
};


module.exports = {
    addToCart,
    getCart,
    updateItem,
    deleteItem

};