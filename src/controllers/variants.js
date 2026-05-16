const variantService = require('../services/variants.js');

const createVariant = async (req, res) => {
    try {
        const id = req.params.id;
        const variant = req.body;
        const result = await variantService.createVariant(id, variant);
        if (result.error1) {
            return res.status(404).json({ message: result.error1 })
        }
        if (result.error2) {
            return res.status(409).json({ message: result.error2 })
        }

        res.status(201).json({
            message: "variant created successfully",
            data: result
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "failed to create variant for this product"
        })
    }
};
const getAllVariants = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await variantService.getAllVariants(id);
        if (result.error) {
            return res.status(404).json({ message: result.error })
        }
        res.status(200).json({ message: "variants retrieved successfully", data: result });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "failed to get variants of this product"
        })
    }

};
const deleteVariant = async (req, res) => {
    try {
        //Just keep a mental note for later that we will eventually need to handle "archiving" or checking if a variant has past orders before allowing anyone to destroy it.

        const id = req.variant.id;
        const deletedVariant = await variantService.deleteVariant(id);
        if (deletedVariant) {
            return res.status(200).json({
                message: "variant deleted successfully",
                data: deletedVariant
            })
        }


    } catch (error) {
        console.log(error);
        if (error.code === "P2025") {
            return res.status(404).json({ message: "this variant does not exist" })
        }
        res.status(500).json({
            message: "failed to delete variant "
        })
    }
};
const updateVariant = async (req, res) => {
    try {
        const oldVariant = req.variant;
        //console.log(oldVariant)
         const updatedVariantData = req.body;
        // console.log(updatedVariantData)

        const id = req.params.variantId;
        const result = await variantService.updateVariant(id,oldVariant,updatedVariantData);
        if(result.error)
        {
            return res.status(400).json({message:result.error});

        }

        return res.status(200).json({
      message: "Variant updated successfully",
      data: result
    }); 
        

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "failed to update variant" })
    }

};

const getVariantById = async (req,res) =>{
    try{
        const id = req.params.variantId;
        const variant = await variantService.getVariantById(id);
        res.status(200).json({
            message:"variant retrived successfully",
            data: variant
        })

    }catch(error)
    {
        console.log(error);
        res.status(500).json({
            message:"failed to get variant"
        })
    }
};

module.exports = {
    createVariant,
    getAllVariants,
    deleteVariant,
    updateVariant,
    getVariantById
}