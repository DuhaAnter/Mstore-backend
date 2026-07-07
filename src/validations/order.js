const joi = require('joi');

const createOrderSchema = joi.object({
    email: joi.string().email().required(),
    fullName: joi.string().required(),
    phone: joi.string().regex(/^01[0125]\d{8}$/).required(),
    shippingAddress: joi.string().max(100).required(),
    city: joi.string().required().max(25),
    governorate: joi.string().required().max(25),
    paymentMethod: joi.valid('CREDIT_CARD', 'CASH_ON_DELIVERY'),

});

module.exports = {
    createOrderSchema,
};