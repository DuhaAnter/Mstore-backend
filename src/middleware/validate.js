exports.validate = (schema) => {
    //return middlware
    return(req, res, next) => {
        
        const {error , value} = schema.validate(req.body, { abortEarly: false ,stripUnknown: true})
        //abortEarly:false means joi will return all errors not just the first one.
        // stripUnknown: true -->deletes any fields sent by the client that aren't defined in your schema
        if (error) {
            return res.status(400).json({
                message: 'fail validation from joi',
                data: error.details.map((err) => err.message)
            });
        } else {
            //Overwrite req.body with the clean, validated Joi value
            req.body = value;
            
            // Proceed
            next();
        }
    }
};