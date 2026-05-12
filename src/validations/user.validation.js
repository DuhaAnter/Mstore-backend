const joi = require ('joi');
//joi schema
const createUserSchema = joi.object({
    name : joi.string().required().min(2),
    email : joi.string().required().email().lowercase(),
    password: joi.string().required(),
    stripUnknown: true //This automatically removes any keys from req.body that aren't defined in your schema like role.

});

const updateUserSchema = createUserSchema.fork(
    ['name', 'email', 'password'], 
    (field) => field.optional()
).min(1); // .min(1) ensures the user doesn't send a totally empty { } object

const loginSchema = joi.object({
    email : joi.string().required().email().lowercase(),
    password: joi.string().required(),
    stripUnknown: true
})
module.exports = {
    createUserSchema,
    updateUserSchema,
    loginSchema
};

