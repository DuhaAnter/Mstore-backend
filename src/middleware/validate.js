exports.validate = (schema) => {
    //return middlware
    return(req, res, next) => {
        
        let x = schema.validate(req.body, { abortEarly: false })
        //abortEarly:false means joi will return all errors not just the first one.

        if (x.error) {
            return res.status(400).json({
                message: 'fail validation from joi',
                data: x.error.details.map((err) => err.message)
            })
        } else {
            //proceed
            next();
        }
    }
};