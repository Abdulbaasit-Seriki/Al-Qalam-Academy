const jwt = require('jsonwebtoken')
const asyncErrorHandler = require('./asyncErrorHandler')
const ErrorResponse = require('./ErrorResponse')
const Teacher = require('../models/Teacher')

// Send Token In A Cookie 
exports.sendCookieToken = (user, req)  => {
    const token = user.assignJWT()
    req.session.userId = token
   
}

exports.protectRoute = asyncErrorHandler( async (req, res, next) => {
    let token

    if (!req.session.userId) {
        return next(new ErrorResponse(
            `Ooopps!!, Not Authorised to Access this Route`, 401)
            .renderErrorPage(res)
        )
    }

    token = req.session.userId 

    if (!token) {
        return next(new ErrorResponse(
            `Ooopps!!, Not Authorised to Access this Route`, 401)
            .renderErrorPage(res)
        )
    }

    //  Verify the Token
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decodedToken)

        req.user = await Teacher.findById(decodedToken.id)
        console.log(req.user)

        next()
    } catch (err) {
            return next(new ErrorResponse(  
            `Ooopps!!, Not Authorised to Access this Route`, 401)
            .renderErrorPage(res)
        )
    }
})

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse(
                `User Role ${req.user.role} is not authorized for this action`, 403)
                .renderErrorPage(res)
            )
        }

        next()
    }
}