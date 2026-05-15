const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();


const getAllSubCates = async ()=>{

    const subCates = await prisma.subCategory.findMany();
    return subCates ;

};
const getSubCateById = async (id)=>{
    const subCate = await prisma.subCategory.findUnique({
        where : {id:id}
    })

    return subCate ;
};
const createSubCate = async (subCate) => {
    const subCateName = subCate.name;
    const subCateExist = await prisma.subCategory.findFirst(
        {
            where: { name: { equals: subCateName, mode: 'insensitive' } }
        }
    )

    if (subCateExist) {
        return { error: "sub category already exists " }
    }
    //before saving clean string
    const formattedName = subCateName.charAt(0).toUpperCase() + subCateName.slice(1).toLowerCase();
    const newSubCate = await prisma.subCategory.create({
        data: { name: formattedName }
    })

    return newSubCate;
};
const deleteSubCate = async(id)=>{
        const subCateExist = await getSubCateById(id);
        if(subCateExist)
        {
            const deletedsubCate = await prisma.subCategory.delete({
                where : {id:id}
            })
            return deletedsubCate;
        }

       
};
const updateSubCate = async(id,subCateUpdatedData)=>
{
    const subCateAfterUpdate = await prisma.subCategory.update({
        where:{id:id},
        data : subCateUpdatedData
    })

    return subCateAfterUpdate;

};

module.exports ={
 getAllSubCates,
 getSubCateById,
 createSubCate,
 updateSubCate,
 deleteSubCate
};