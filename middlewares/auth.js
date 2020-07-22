const jwt = require('jsonwebtoken')
const asyncErrorHandler = require('./asyncErrorHandler')
const ErrorResponse = require('./ErrorResponse')
const Teacher = require('../models/Teacher')

// Send Token In A Cookie 
exports.sendCookieToken = (user, res, path)  => {
    const token = user.assignJWT()

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRY_DATE * 24 * 360 * 1000
        ),
        httpOnly: true
    }

    if (process.env.NODE_ENV = 'production') {
        options.secure = true
    }

    res.cookie('token', token, options).redirect(path)
}

exports.protectRoute =  (templatePath) => {
    return asyncErrorHandler( async (req, res, next) => {
        let token;

        if (req.cookies.token) {
            token = req.cookies.token
        }
    
        if (!token) {
            return next(new ErrorResponse(
                `Ooopps!!, Not Authorised to Access this Route`, 401)
                .redirect(res, templatePath)
            )
        }
    
        // Verify the Token
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
            console.log(decodedToken)
    
            req.user = await Teacher.findById(decodedToken.id)
    
            next()
        } catch (err) {
            return next(new ErrorResponse(
                `Ooopps!!, Not Authorised to Access this Route`, 401)
                .redirect(res, templatePath)
            )
        }
    }) 
}


exports.authorize = (templatePath, ...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.roles)) {
            return next(new ErrorResponse(
                `User Role ${req.user.role} is not authorized for this action`, 403)
                .redirect(res, templatePath)
            )
        }

        next()
    }
}