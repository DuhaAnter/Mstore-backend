const joi = require('joi');

const cartItemSchema = joi.object({
    variantId : joi.string().required(),
    quantity : joi.number().greater(0).required()

});

module.exports = {
    cartItemSchema
};