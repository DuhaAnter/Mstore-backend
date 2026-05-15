const joi = require('joi');
// this fun is not used because in crtl u still use req.body not joi value
const capitalize = (value, helpers) => {
  if (typeof value !== 'string') return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};


const createCateSchema = joi.object({
    name : joi.string().trim().required().max(50).min(3).custom(capitalize, 'Capitalization logic'),
    stripUnknown: true 
});
const updateCateSchema = createCateSchema.fork(['name'], (field)=> field.optional()).min(1);

const linkCateSubCateSchema = joi.object({
    categoryId:joi.string().required(),
    subCategoryId:joi.string().required(),
    stripUnknown:true
})

module.exports ={
    createCateSchema,
    updateCateSchema,
    linkCateSubCateSchema
}