const { PrismaClient } = require('@prisma/client');
const { getCart } = require('./cart');
const prisma = new PrismaClient();

const createOrder = async (userId, orderData) => {
    //1. grap the user cart 
    const { cart } = await getCart(userId);

    if (!cart || cart.length === 0) {
        return { error: "Your cart is empty. Cannot place an order" };
    }

    // 2. check stock 
    for (const item of cart) {
        if (item.variant.stock < item.quantity) {
            return { error: `Insufficient stock for variant item. Only ${item.variant.stock} left in stock.` }
        }
    }

    //3. calculate sub total money
    let subtotal = 0;
    (cart).forEach(item => {
        subtotal += item.variant.price * item.quantity;
    });

    //4. check if there is coupon applied 
    const CpnApplied = await prisma.cart.findUnique({
        where: { userId },
        include: { coupon: true }
    });

    let discountApplied = 0;

    if (CpnApplied.coupon) {
        discountApplied = (subtotal * CpnApplied.coupon.discount) / 100;
    }
    const discountedSubtotal = subtotal - discountApplied;
    const tax = discountedSubtotal * 0.01;
    const total = discountedSubtotal + tax;

    // if everything is okay Congrates! we can create he order now

    //5. Execute ACID Database Transaction
    const finalOrder = await prisma.$transaction(async (tx) => {
        // Step A: Create the permanent Order record
        const couponId = CpnApplied.couponId;
        const order = await tx.order.create({
            data: {
                userId,
                subtotal,
                total,
                discountApplied,
                couponId,
                ...orderData
            }
        });
        // Step B: Create historical OrderItems snapshots & decrement Variant stock
        for (const item of cart) {
            // Create the snapshot (orderItem) record
            await tx.orderItem.create({
                data: {
                    orderId: order.id,
                    variantId: item.variantId,
                    quantity: item.quantity,
                    priceAtPurchase: item.variant.price
                }
            });

            // Deduct items from stock
            await tx.variant.update({
                where: { id: item.variantId },
                data: {
                    stock: {
                        decrement: item.quantity
                    }
                }
            });
        }//end of for

        // Step C: Clear the user's Cart items
        //here we need to delete the cart so cpn is cleared
        await tx.cartItem.deleteMany({
            where: { cartId: cart.cartId }
        });



        return order;
    })//end of Database Transaction


    return finalOrder;



};
//for admin
const getAllOrders = async () => {
    const orders = await prisma.order.findMany({
        include: { items: { include: { variant: { select: { size: true, color: true, product: { select: { title: true, imageURL: true } } } } } }, coupon: { select: { code: true, discount: true } } },
        orderBy: {
            createdAt: "desc",
        },

    });
    return orders;
};
//for user
const getAllOrdersForCertainUser = async (userId) => {
    const orders = await prisma.order.findMany({
        where: { userId },
        orderBy: {
            createdAt: "desc",
        },
        include: { items: { include: { variant: { select: { size: true, color: true, product: { select: { title: true, imageURL: true } } } } } }, coupon: { select: { code: true, discount: true } } }
    });
    return orders;
};
const getOrder = async (id) => {
    const order = await prisma.order.findUnique({
        where: { id },
        include: { items: { include: { variant: { include: { product: true } } } } }
    });

    return order;
};
const updateOrderStatus = async (id, updatedOrderData) => {
    // Verify the order exists before updating
    const existingOrder = await prisma.order.findUnique({
        where: { id }
    });

    if (!existingOrder) {
        return { error: "Order not found." };
    }

    // if exist , update
    const updatedOrder = await prisma.order.update({
        where: { id },
        data: {
            status: updatedOrderData.status,
            paymentStatus: updatedOrderData.paymentStatus
        }
    });
    return updatedOrder;
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrder,
    updateOrderStatus,
    getAllOrdersForCertainUser
};