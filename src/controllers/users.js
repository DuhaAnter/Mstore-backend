const { date } = require('joi');
const userService = require('../services/users.js');


const getAllUsers = async (req, res) => {
    try {

        const users = await userService.getAllUsers();
        res.status(200).json({
            message: "users retrived successfully",
            data: users
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "failed to get all users" })
    }
};
const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userService.getUserById(id);
        if (!user) {
            res.status(404).json({ message: "user not found" });
        }
        res.status(200).json({
            message: "user retrived successfully",
            data: user
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "failed to get user by id" })
    }
};

const createUser = async (req, res) => {
    try {
        //Because my middleware has already validated and "cleaned" the data, i can trust req.body .
        const user = req.body;
        const result = await userService.createUser(user);
        if (result.error) {
            return res.status(409).json({
                message: result.error // This will say "Email already exists"
            });
        }

        res.status(201).json({
            message: "user created successfully",
            data: result
        })


    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "failed to create user" })
    }
};
const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const userUpdatedData = req.body;
        const userToUpdate = await userService.getUserById(id);
        if (!userToUpdate) {
            return res.status(404).json({ message: "user not found" });
        }
        const userAfterUpdate = await userService.updateUser(id, userUpdatedData);
        res.status(200).json({
            message: "user updated successfully",
            data: userAfterUpdate
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "failed to update user"
        })
    }

};
const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const userToDelete = await userService.getUserById(id);
        if (!userToDelete) {
            res.status(404).json({ message: "user not found or already deleted" });
        }
        const deletedUser = await userService.deleteUser(id);
        res.status(200).json({
            message: "user deleted successfully",
            data: deletedUser
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "failed to delete user" })
    }
};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await userService.login(email, password);
        if (result.error1) {
            res.status(404).json({ message: "email not found try Resigter" })
        }
        if (result.error2) {
            res.status(401).json({ message: "wrong password try again" })
        }
        if (result.token) {
            res.status(200).json({
                message: "success u r logged in",
                data: result
            })
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "failed to login" })
    }
};


module.exports = {
    getAllUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    login
};