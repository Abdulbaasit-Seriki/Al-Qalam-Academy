const jwt = require('jsonwebtoken')
const asyncErrorHandler = require('./asyncErrorHandler')
const ErrorResponse = require('./ErrorResponse')
const Teacher = require('../models/Teacher')

// Send Token In A Cookie 
exports.sendCookieToken = (user, req)  => {
    const token = user.assignJWT()
    req.session.userId = token
    req.session.createdAt = Date.now()
}

exports.ensureAuth = asyncErrorHandler( async (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    else if(req.session.userId) {
        
    }
})

exports.protectRoute = asyncErrorHandler( async (req, res, next) => {
    let token

    if (!req.session.userId) {
        return next(new ErrorResponse(
            `Ooopps!!, Not Authorised to Access this Route`, 401)
            .redirect(res, 'auth/users/login')
        )
    }  

    token = req.session.userId 

    if (!token) {
        return next(new ErrorResponse(
            `Ooopps!!, Not Authorised to Access this Route`, 401)
            .redirect(res, 'auth/users/login')
        )
    }

    //  Verify the Token 
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await Teacher.findById(decodedToken.id)
        next()
    } catch (err) {
        return next(new ErrorResponse(
            `Ooopps!!, Not Authorised to Access this Route`, 401)
            .redirect(res, 'auth/users/login')
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

exports.logOut = asyncErrorHandler( async (req, res, next) => {
    return new Promise((resolve, reject) => {
        req.session.destroy( err => {
            if (err) {
                reject(err)
            }  

            res.clearCookie(process.env.SESSION_NAME)
            resolve()
        })
    })
})

exports.isEmailVerified = asyncErrorHandler( async (req, res, next) => {
    if (!req.user.isVerified) {
        return next(new ErrorResponse( 
            `Please Verify Your Email Before You Can Continue`, 403)
            .renderErrorPage(res)
        )
    } else {
        next()
    }
})