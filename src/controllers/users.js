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
        const isProduction = process.env.NODE_ENV === 'production';

        const cookieOptions = {
            httpOnly: true,                    // ← Almost always true for auth cookies
            secure: isProduction,              // true in prod, false in local (localhost)
            sameSite: isProduction ? 'none' : 'lax',   // Adjust based on your setup
            maxAge: 7 * 24 * 60 * 60 * 1000,   // 7 days (correct way)
        };
        if (result.token) {
            res.status(200).cookie('token', result.token, cookieOptions).json({
                message: "success u r logged in",
                data: result.user,
                token:result.token
            })
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "failed to login" })
    }
};
const forget = async (req, res) => {
    try {
        const { email } = req.body;
        const reply = await userService.forget(email);
        res.status(200).json({ message: "If an account exists with this email, a reset code has been sent" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "failed to process forget" })
    }

};
const verfiyOtp = async (req, res) => {
    try {
        const { email, otpCode } = req.body;
        const reply = await userService.verifyOtp(email, otpCode);
        if (reply.error404) {
            return res.status(404).json({ message: reply.error404 })
        }
        if (reply.error410) {
            return res.status(410).json({ message: reply.error410 })
        }
        if (reply.error400) {
            return res.status(400).json({ message: reply.error400 })
        }
        res.status(200).json({ message: reply.message })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "failed to verfiy otp" })
    }
};
const resetPassword = async (req, res) => {
    try {
        const { email, otpCode, newPassword } = req.body;

        const reply = await userService.resetPassword(email, otpCode, newPassword);
        if (reply.error) {
            return res.status(400).json({ message: reply.error })
        }
        res.status(200).json({
            message: "password reseted successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "failed to reset password" })
    }
};


module.exports = {
    getAllUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    login,
    forget,
    verfiyOtp,
    resetPassword
};