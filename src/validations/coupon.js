const Joi = require('joi');

const createCouponSchema = Joi.object({
    code: Joi.string().alphanum().uppercase().trim().required()
    ,
    discount: Joi.number().positive().max(100).required()
    ,
    expiresAt: Joi.date().greater('now').required()
});
const updateCouponSchema = createCouponSchema.fork(
    ['discount', 'expiresAt'],
    (field) => field.optional()
)
//// When flagging a field as .forbidden(), Joi shifts its internal error type for that field to any.unknown because it is no longer recognized as a permissible input parameter for this schema.
//When you attach .messages() to the very end of the .fork().forbidden().min(1) chain, you are overwriting the error messages for the entire object schema, not just the code field and that's why we used the keys method.
.keys(
    {
//never allow an admin to change a coupon code once it has been created.
        code : Joi.any().forbidden().messages({
        'any.unknown': 'The "code" field cannot be modified once a coupon is created.'
    })
    }
)
.min(1);
module.exports = {
    createCouponSchema,
    updateCouponSchema
};