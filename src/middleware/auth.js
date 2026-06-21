const jwt = require('jsonwebtoken');

exports.auth = (req, res, next) => {
    try {
        // const { authorization } = req.headers;
        // if (!authorization) {
        //     return res.status(401).json({
        //         message: "you are not logged in , please log in first"
        //     })
        // }
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "You are not logged in , please log in first",
            });
        }
        //const decoded = jwt.verify(authorization, process.env.SECRET);
        const decoded = jwt.verify(token, process.env.SECRET);
        console.log(decoded);
        req.userId = decoded.id;
        req.userRole = decoded.role;
        req.userName = decoded.name;
        //proceed
        next();
    } catch (error) {
        res.status(400).json({
            message: "fail from authorization u are not authenticated"
        })
    }

};
exports.restrictTo = (...roles) => {

    return (req, res, next) => {
        if (!roles.includes(req.userRole)) {
            res.status(401).json({
                message: "you are not allowed to perform this action"
            })
        } else {
            next();
        }
    }
}