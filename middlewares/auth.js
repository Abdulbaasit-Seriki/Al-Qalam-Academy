const jwt = require('jsonwebtoken')
const asyncErrorHandler = require('./asyncErrorHandler')
const ErrorResponse = require('./ErrorResponse')
const Teacher = require('../models/Teacher')

// Send Token In A Cookie 
exports.sendCookieToken = (user, req)  => {
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

    req.session.token = token
    console.log(token)
    console.log(req.session.token)
    req.sessionOptions = options
}

// exports.protectRoute =  (templatePath) => {
//     return asyncErrorHandler( async (req, res, next) => {
//         let token

//         if (req.session.token) {
//             token = req.session.token
//         }
    
//         if (!token) {
//             return next(new ErrorResponse(
//                 `Ooopps!!, Not Authorised to Access this Route`, 401)
//                 .renderErrorPage(res)
//             )
//         }
    
//         // Verify the Token
//         try {
//             const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
//             console.log(decodedToken)
    
//             req.user = await Teacher.findById(decodedToken.id)
    
//             next()
//         } catch (err) {
//              return next(new ErrorResponse(
//                 `Ooopps!!, Not Authorised to Access this Route`, 401)
//                 .renderErrorPage(res)
//             )
//         }
//     }) 
// }

exports.protectRoute = asyncErrorHandler( async (req, res, next) => {
    if (!req.session.token) {
        return next(new ErrorResponse(
            `Ooopps!!, Not Authorised to Access this Route`, 401)
            .renderErrorPage(res)
        )
    }

    next();
})

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