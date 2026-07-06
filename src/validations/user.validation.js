const joi = require('joi');
//joi schema
const createUserSchema = joi.object({
    name: joi.string().required().min(2),
    email: joi.string().required().email().lowercase(),
    password: joi.string().required(),
    role : joi.optional(),
    stripUnknown: true //This automatically removes any keys from req.body that aren't defined in your schema like role.

});

const updateUserSchema = createUserSchema.fork(
    ['name', 'email', 'password', 'role'],
    (field) => field.optional()
).min(1); // .min(1) ensures the user doesn't send a totally empty { } object

const loginSchema = joi.object({
    email: joi.string().required().email().lowercase(),
    password: joi.string().required(),
    stripUnknown: true
});
const forgetSchema = joi.object({
    email: joi.string().required().email().lowercase(),
    stripUnknown: true
});
const verifyOtpSchema = joi.object({
    email: joi.string().required().email().lowercase().trim(),
    otpCode: joi.string().pattern(/^[0-9]+$/).length(6).required().trim(),
    stripUnknown: true
});
const resetPasswordSchema = verifyOtpSchema.fork(
    ['email', 'otpCode'],
    (field) => field.required() // Ensures email and otpCode stay required
).append({
    newPassword: joi.string().required() // Appends the new password field
});
module.exports = {
    createUserSchema,
    updateUserSchema,
    loginSchema,
    forgetSchema,
    verifyOtpSchema,
    resetPasswordSchema
};

