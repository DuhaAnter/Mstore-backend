const express = require ('express');
const router = express.Router();

const userCtrl = require ('../controllers/users.js');
const {createUserSchema,updateUserSchema,loginSchema,forgetSchema,verifyOtpSchema,resetPasswordSchema} = require('../validations/user.validation.js');
const {validate} = require('../middleware/validate.js')



router.get('/',userCtrl.getAllUsers);
router.get('/:id',userCtrl.getUserById);
//register
router.post ('/',validate(createUserSchema),userCtrl.createUser);

router.patch('/:id',validate(updateUserSchema),userCtrl.updateUser);
router.delete('/:id',userCtrl.deleteUser);

//login
router.post('/login',validate(loginSchema),userCtrl.login);
//forget_password
router.post('/forget-password',validate(forgetSchema),userCtrl.forget);
router.post('/verify-otp',validate(verifyOtpSchema),userCtrl.verfiyOtp);
router.post('/reset-password',validate(resetPasswordSchema),userCtrl.resetPassword);

module.exports = router;