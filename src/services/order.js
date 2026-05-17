const { PrismaClient } = require('@prisma/client');
const { getCart } = require('./cart');
const prisma = new PrismaClient();

const checkout = async (userId, orderData) => {
    // first grap the user cart 
    const cartItems = await getCart(userId);

    if (!cartItems || cartItems.length === 0) {
        return { error: "Your cart is empty. Cannot place an order" };
    }

    //second check stock 
    for (const item of cartItems) {
        if (item.variant.stock < item.quantity) {
            return { error: `Insufficient stock for variant item. Only ${item.variant.stock} left in stock.` }
        }
    }
    // calculate total
    let total = 0;
    cartItems.forEach(item => {
        total += item.variant.price * item.quantity;
    });

    //Calculating coupon discounts if exist
    //---> for later

    //Execute ACID Database Transaction
    const finalOrder = await prisma.$transaction(async (tx) =>
         {
        // Step A: Create the permanent Order record
        const order = await tx.order.create({
            data: {
                userId,
                total,
                shippingAddress: "none for now",
                couponId: "660a7314-1663-4aaf-ac23-b5aedbe48a11",
                discountApplied: 10,
                paymentMethod:  "CASH_ON_DELIVERY",
                paymentStatus: "PENDING",
                status: "PENDING"
            }
        });
        // Step B: Create historical OrderItems snapshots & decrement Variant stock
        for (const item of cartItems) 
            {
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
        }//enf of for

        // Step C: Clear the user's Cart items
        await tx.cartItem.deleteMany({
            where: { cartId: cartItems.cartId }
        });

       

        return order;
    })//end of Database Transaction


    return finalOrder;



};
const getAllOrders = async ()=>{
        const orders = await prisma.order.findMany();
        return orders;
};
const getOrder = async(id)=>{
    const order = await prisma.order.findUnique({ 
      where: { id },
      include: { items: { include: { variant: {include : {product:true}} } } }
    });

    return order;
};
const updateOrderStatus= async(id,updatedOrderData)=>{
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
        status: updatedOrderData.status ,
        paymentStatus: updatedOrderData.paymentStatus 
      }
    });
    return updatedOrder;
};

module.exports = {
    checkout,
    getAllOrders,
    getOrder,
    updateOrderStatus
};