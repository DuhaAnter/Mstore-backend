const cateService = require('../services/categories.js');

const getAllCates = async (req, res) => {
    try {

        const cates = await cateService.getAllCates();
        if (cates) {
            res.status(200).json({
                message: "categories retrived successfully",
                data: cates
            })
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "failed to get categories"
        })
    }
};
const getCateById = async (req, res) => {
    try {
        const id = req.params.id;
        const cate = await cateService.getCateById(id);
        if (!cate) {
            res.status(404).json({
                message: "category not found"
            })
        }
        res.status(200).json({
            message: "category retrived successfully",
            data: cate
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "failed to get category by id"
        })
    }
};

const createCate = async (req, res) => {
    try {
        const cate = req.body;
        const result = await cateService.createCate(cate);
        if (result.error) {
            return res.status(409).json({
                message: result.error
            })
        }

        res.status(201).json({
            message: "category created successfully",
            data: result
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "failed to create category"
        })
    }

};
const deleteCate = async (req, res) => {
    try {
        const id = req.params.id;
        const cateToDelete = await cateService.getCateById(id);
        if (!cateToDelete) {
            return res.status(404).json({ message: "category not found or already deleted" })
        }

        const deletedCate = await cateService.deleteCate(id);
        return res.status(200).json({
            message: "category deleted successfully",
            data: deletedCate
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "failed to delete category"
        })
    }


};
const updateCate = async (req,res) =>{
    try{
        const id = req.params.id;
        const cateUpdatedData=req.body;
        const cateToUpdate = await cateService.getCateById(id);
        if(!cateToUpdate)
        {
            return res.status(404).json({message:"category not found"})
        }

        const cateAfterUpdate = await cateService.updateCate(id,cateUpdatedData);
        res.status(200).json({
            message:"category updated successfully",
            data: cateAfterUpdate
        })

    }catch(error)
    {
        console.log(error);
        res.status(500).json({message:"failed to update category"})
    }
};

const linkSubCate= async (req,res)=>{
    try{
        const group = req.body;
        const linkGroup = await cateService.linkSubCate(group);
        res.status(201).json({
            message:"sub category linked to the category successfully",
            data: linkGroup
        })


    }catch(error)
    {
    // Handle Prisma P2002 if they are already linked
    if (error.code === 'P2002') {
      return res.status(400).json({ message: "This subcategory is already linked to this category" });
    }
        console.log(error);
       return res.status(500).json({message:"failed to update category"});
    
  }
};
const getSubCatesByCateID =async (req,res)=>{
    try{
        const id = req.params.id;
        const cateToFetch = await cateService.getCateById(id);
        if(!cateToFetch)
        {
            return res.status(404).json({message:"category not found"})
        }
        const subcates = await cateService.getSubCatesByCateID(id);
        res.status(200).json({
            message:"subcategories retrieved successfully",
            data : subcates
        })

    }catch(error)
    {
        console.log(error);
        res.status(500).json({
            message:"failed to fetch subcatgories of this category"
        })
    }
};


module.exports = {
    getAllCates,
    getCateById,
    createCate,
    deleteCate,
    updateCate,
    linkSubCate,
    getSubCatesByCateID


}