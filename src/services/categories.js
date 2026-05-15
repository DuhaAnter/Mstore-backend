const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const getAllCates = async () => {

    const cates = await prisma.category.findMany();
    return cates;

};
const getCateById = async (id) => {
    const cate = await prisma.category.findUnique({
        where: { id: id }
    })

    return cate;
};
const createCate = async (cate) => {
    const cateName = cate.name;
    const cateExist = await prisma.category.findFirst(
        {
            where: { name: { equals: cateName, mode: 'insensitive' } }
        }
    )

    if (cateExist) {
        return { error: "category already exists " }
    }
    //before saving clean string
    const formattedName = cateName.charAt(0).toUpperCase() + cateName.slice(1).toLowerCase();
    const newCate = await prisma.category.create({
        data: { name: formattedName }
    })

    return newCate;
};
const deleteCate = async(id)=>{
        const cateExist = await getCateById(id);
        if(cateExist)
        {
            const deletedCate = await prisma.category.delete({
                where : {id:id}
            })
            return deletedCate;
        }

       
};
const updateCate = async(id,cateUpdatedData)=>
{
    const cateAfterUpdate = await prisma.category.update({
        where:{id:id},
        data : cateUpdatedData
    })

    return cateAfterUpdate;

};
const linkSubCate = async(group)=>{
        const linkGroup = await prisma.catSubCategory.create({
            data:group
        })
        return linkGroup;
};
const getSubCatesByCateID = async (id)=>{
    const relations = await prisma.catSubCategory.findMany({
      where: { categoryId : id },
      include: {
        subCategory: true // This grabs the actual name and details of the subcategory
      }
    }); 
    // Flatten the array so it just returns a clean list of subcategories
    const subCategories = relations.map(r => r.subCategory);
    return subCategories;
};

module.exports = {
    getAllCates,
    getCateById,
    createCate,
    deleteCate,
    updateCate,
    linkSubCate,
    getSubCatesByCateID
};