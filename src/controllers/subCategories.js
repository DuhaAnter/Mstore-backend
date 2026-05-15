const subCateService = require('../services/subCategories.js');

const getAllSubCates = async (req, res) => {
    try {

        const subCates = await subCateService.getAllSubCates();
        if (subCates) {
            res.status(200).json({
                message: "subcategories retrived successfully",
                data: subCates
            })
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "failed to get subcategories"
        })
    }
};
const getSubCateById = async (req, res) => {
    try {
        const id = req.params.id;
        const subCate = await subCateService.getSubCateById(id);
        if (!subCate) {
            res.status(404).json({
                message: "subcategory not found"
            })
        }
        res.status(200).json({
            message: "subcategory retrived successfully",
            data: subCate
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "failed to get subcategory by id"
        })
    }
};
const createSubCate = async (req, res) => {
    try {
        const subCate = req.body;
        const result = await subCateService.createSubCate(subCate);
        if (result.error) {
            return res.status(409).json({
                message: result.error
            })
        }

        res.status(201).json({
            message: "sub category created successfully",
            data: result
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "failed to create sub category"
        })
    }

};
const deleteSubCate = async (req, res) => {
    try {
        const id = req.params.id;
        const subCateToDelete = await subCateService.getSubCateById(id);
        if (!subCateToDelete) {
            return res.status(404).json({ message: "subCategory not found or already deleted" })
        }

        const deletedsubCate = await subCateService.deleteSubCate(id);
        return res.status(200).json({
            message: "subCategory deleted successfully",
            data: deletedsubCate
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "failed to delete subCategory"
        })
    }


};
const updateSubCate = async (req,res) =>{
    try{
        const id = req.params.id;
        const subCateUpdatedData=req.body;
        const subCateToUpdate = await subCateService.getSubCateById(id);
        if(!subCateToUpdate)
        {
            return res.status(404).json({message:"subCategory not found"})
        }

        const subCateAfterUpdate = await subCateService.updateSubCate(id,subCateUpdatedData);
        res.status(200).json({
            message:"subCategory updated successfully",
            data: subCateAfterUpdate
        })

    }catch(error)
    {
        console.log(error);
        res.status(500).json({message:"failed to update subCategory"})
    }
};


module.exports = {
    getAllSubCates,
    getSubCateById,
    createSubCate,
    updateSubCate,
    deleteSubCate
}