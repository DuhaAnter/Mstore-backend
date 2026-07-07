const orderService = require('../services/order.js');

const createOrder = async (req, res) => {
    try {
        const orderData = req.body;
        const userId = req.userId;
        const result = await orderService.createOrder(userId, orderData);
        if (result.error) {
            return res.status(400).json({ message: result.error })
        }
        res.status(200).json({
            status: "success", message: "order placed successfully",
            data: result
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "failed to place an order" })
    }
};
const getAllOrders = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        res.status(200).json({
            message: "orders retrives successfully",
            data: orders
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "failed to get all orders" })
    }
};
const getAllOrdersForCertainUser = async (req, res) => {
    try {
        const userId = req.userId;
        const orders = await orderService.getAllOrdersForCertainUser(userId);
        res.status(200).json({
            message: "orders retrives successfully",
            data: orders
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "failed to get all orders for certain user" })
    }
};

const getOrder = async (req, res) => {
    try {
        const id = req.params.id;
        const order = await orderService.getOrder(id);
        res.status(200).json({
            message: "order retrives successfully",
            data: order
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "failed to get  order" })
    }
};
const updateOrderStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedOrderData = req.body;
        const result = await orderService.updateOrderStatus(id, updatedOrderData);
        if (result.error) {
            return res.status(404).json({ message: result.error });
        }
        res.status(200).json({
            message: "order updated successfully",
            data: result
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "failed to update  order" })
    }
};
module.exports = {
    createOrder,
    getAllOrders,
    getOrder,
    updateOrderStatus,
    getAllOrdersForCertainUser
};