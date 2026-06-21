const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const { sendEmail } = require('../utils/sendEmail');
const { getPasswordResetTemplate } = require('../utils/emailTemplates');
const { string } = require('joi');


const getAllUsers = async () => {
    const users = await prisma.user.findMany();
    return users;
};
const getUserById = async (id) => {
    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    })

    return user;
};
const createUser = async (user) => {
    //check if user exists
    const { email } = user;
    const userExist = await prisma.user.findUnique({ where: { email } });
    if (userExist) {
        return { error: 'Email already exists' };
    }
    //new user --> first hash the password
    const { password } = user;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    const newUser = await prisma.user.create({
        data: user
    })

    return newUser;
};
const updateUser = async (id, userUpdatedData) => {
    const userAfterUpdate = await prisma.user.update({
        where:
        {
            id: id
        },
        data: userUpdatedData
    })

    return userAfterUpdate;
};
const deleteUser = async (id) => {
    const deletedUser = await prisma.user.delete({
        where: { id: id }
    })
    return deletedUser;
};
const login = async (email, password) => {
    // make sure user exist before comparing passwords
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            cart: {
                include: {
                    items: {
                        select: {
                            quantity: true
                        }
                    }
                },
                omit: {
                    id: true,
                    userId: true
                }
            }
        }
    });
    if (!user) {
        return { error1: "email does not exist" }
    }
    //if user exist compare password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        return { error2: "wrong password" }
    }
    //if password right generate token
    //The first argument of jwt.sign() is the payload. This is the data that will be encoded into the token.
    const token = await jwt.sign({ id: user.id, name: user.name, role: user.role }
        , process.env.SECRET
        , { expiresIn: '7d' })

    return { token: token, user: user }
};
const forget = async (email) => {
    //make sure email exists 
    const userFound = await prisma.user.findUnique({ where: { email } });
    // if not 
    if (!userFound) {
        //Stop here
        return;
    }
    // if it does , Proceed
    //1. Generate OTP
    const otp = crypto.randomInt(100000, 1000000);
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);
    //2. save them to db
    const userAfterOtp = await prisma.user.update({
        where: { email },
        data: {
            otpCode: String(otp),
            otpExpiresAt: expiresAt
        }
    })
    //. send email with otp 
    const { subject, html, text } = getPasswordResetTemplate(otp);
    sendEmail({
        to: 'dohabackup99@gmail.com',
        subject,
        text,
        html
    });

};
const verifyOtp = async (email, otpCode) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return { error404: "user not found" }
    }

    const isExpired = new Date() > user.otpExpiresAt;
    if (otpCode === user.otpCode && isExpired) {
        return { error410: "otp code has expired try requesting a new one" }
    }
    else if (otpCode != user.otpCode) {
        return { error400: "otp code is incorrect" }
    }

    return { message: "verification code is correct" }

};
const resetPassword = async (email, otpCode, newPassword) => {
    const verification = await verifyOtp(email, otpCode);
    if (!verification.message) {
        return { error: "something is wrong otp is expired or incorrect" }
    }
    const salt = await bcrypt.genSalt(10);
    const newPasswordHashed = await bcrypt.hash(newPassword, salt);
    const user = await prisma.user.findUnique({ where: { email } });
    console.log(user)
    user.password = newPasswordHashed;
    const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
            password: newPasswordHashed,
            otpCode: null,
            otpExpiresAt: null
        }
    })
    console.log(updatedUser)

    return updatedUser;
};
module.exports = {
    getAllUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    login,
    forget,
    verifyOtp,
    resetPassword
}