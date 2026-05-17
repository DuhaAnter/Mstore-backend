const joi = require('joi');
const createVariantSchema = joi.object({
        color : joi.string().trim().min(2).max(50).required(),
        price : joi.number().greater(0).precision(2).required(),
        size : joi.string().uppercase().min(1).max(10).required(),
        stock : joi.number().greater(0).required()
        
});

const updateVariantSchema = createVariantSchema.fork(
    ['color','price','size','stock'],
    (field)=> field.optional()
).min(1)
module.exports ={
    createVariantSchema,
    updateVariantSchema
}