const productsService = require('../services/products');

const getAllProducts = async (req, res) => {
    try {
        const products = await productsService.getAllProducts();
        res.status(200).json({
            message: "products retrived successfully",
            products: products
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "failed to get all products" })
    }

};

const getProductById = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await productsService.getProductById(id);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({
            message: "product retrived successfully",
            product: product
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "failed to get product" })
    }
};

const createProduct = async (req, res) => {

    try {
        const {product} = req.body
        const created = await productsService.createProduct(product);
        if(created)
        {
            res.status(201).json({
            message: "products created successfully",
            createdProduct : created
        })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json("Failed To create Product");
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const productToUpdate = await productsService.getProductById(id);
        if(! productToUpdate)
        {
             res.status(404).json({ message: "Product to update not found" });
        }
        // Use destructuring to pull out fields that should NEVER be updated manually
        // and collect the rest in a 'updatedData' object.
        const { id: _, createdAt, ...updatedData } = req.body;
        //console.log(createdAt); --> undefined "forgot to add it in the db"
 
        const updatedProduct = await productsService.updateProduct(id, updatedData);

        res.status(200).json({
            message: "product updated successfully",
            productUpdated: updatedProduct
        });

    }
    catch (error) {
        console.log(error);

        if (error.code === 'P2025') {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(500).json({ message: "failed to update product" });
    }

};

const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const productToDelete = await productsService.getProductById(id);
        if (!productToDelete) {
            res.status(404).json({ message: "Product not found or already deleted" });
        }
        const deletedProduct = await productsService.deleteProduct(id);
        res.status(200).json({
            message: "product deleted successfully",
            productDeleted: deletedProduct
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "failed to delete product" })
    }


};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};