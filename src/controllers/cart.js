const cartService = require('../services/cart.js');

const getCart = async (req, res) => {
    try {
        const userId = 'f472b9bf-8fb8-4f9a-9737-6314ffac538e';
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
        const userId = 'f472b9bf-8fb8-4f9a-9737-6314ffac538e';
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
        const userId = 'f472b9bf-8fb8-4f9a-9737-6314ffac538e';
        const updatedItem = req.body;
        const result = await cartService.updateItem(userId, id, updatedItem);
        if (result.error1) {
            return res.status(404).json({ message: "Cart item not found." });
        }

        if (result.error2) {
            return res.status(403).json({
                message: "Not authorized to update this cart item."
            });
        }


        res.status(200).json({ message: "item updated successfully", data: result })

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
        const userId = 'f472b9bf-8fb8-4f9a-9737-6314ffac538e';
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
            message: "item deleted successfully",
            data: result
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "failed to delete item"
        })
    }
};
module.exports = {
    getCart,
    addToCart,
    deleteItem,
    updateItem
};