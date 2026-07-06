const cartService = require('../services/cart.js');

const getCart = async (req, res) => {
    try {
        const userId = req.userId;
        const cart = await cartService.getCart(userId);
        if (cart) {
            res.status(200).json({
                message: "cart viewed successfully",
                data: cart
            }

            )
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "failed to get cart" })
    }

};
const addToCart = async (req, res) => {
    try {
        const userId = req.userId;
        const item = req.body;
        const itemAdded = await cartService.addToCart(userId, item);
        if (itemAdded) {
            res.status(201).json({
                message: "item added successfully",
                data: itemAdded
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "failed to add item"
        })
    }



};
const updateItem = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.userId;
        const updatedItem = req.body;
        const result = await cartService.updateItem(userId, id, updatedItem);
        if (result.status === "NOT_FOUND") {
            return res.status(404).json({ message: "Cart item not found." });
        }

        if (result.status === "FORBIDDEN") {
            return res.status(403).json({
                message: "Not authorized to update this cart item."
            });
        }
        if (result.insufficientStock) {
            return res.status(400).json({
                message: "insufficient Stock"
            });
        }

        res.status(200).json({ status: result.status, message: result.messsage })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "failed to update item"
        })
    }
};
const deleteItem = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.userId;
        const result = await cartService.deleteItem(userId, id);
        if (result.error1) {
            return res.status(404).json({ message: "Cart item not found." });
        }

        if (result.error2) {
            return res.status(403).json({
                message: "Not authorized to delete this cart item."
            });
        }


        res.status(200).json({
            status: result.status,
            message: result.message

        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "failed to delete item"
        })
    }
};
const applyCoupon = async (req, res) => {
    try {
        const userId = req.userId;
        const code = req.body.code;
        const result = await cartService.applyCoupon(userId, code);
        if (result.status === 'NOT_FOUND') {
            return res.status(404).json({ message: "this coupon doesn't exist" })
        }
        if (result.valid === false) {
            return res.status(400).json({ message: "this coupon is expired" })
        }

        return res.status(200).json({ status: 'success', message: "coupon applied successfully" })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "failed to apply coupon"
        })
    }
};
module.exports = {
    getCart,
    addToCart,
    deleteItem,
    updateItem,
    applyCoupon
};