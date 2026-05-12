const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


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
    const user = await prisma.user.findUnique({ where: { email } });
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
        , { expiresIn: '1d' })

    return { token: token }
};


module.exports = {
    getAllUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    login
}