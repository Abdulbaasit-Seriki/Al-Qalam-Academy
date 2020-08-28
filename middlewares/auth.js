const jwt = require('jsonwebtoken')
const asyncErrorHandler = require('./asyncErrorHandler')
const ErrorResponse = require('./ErrorResponse')
const Teacher = require('../models/Teacher')
const Student = require('../models/Student')

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
        return next()
    }
    else {
        return next(new ErrorResponse(
            `Ooopps!!, Not Authorised to Access this Route`, 401)
            .redirect(res, 'auth/users/login')
        )
    }
})

exports.ensureGuest = asyncErrorHandler( async (req, res, next) => {
    if (!req.session.userId) {
        return next()
    }
})

exports.protectRoute = asyncErrorHandler( async (req, res, next) => {
    let token, user

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

        user = await Teacher.findById(decodedToken.id)
        if(!user) {
            user = await Student.findById(decodedToken.id)
        }

        req.user = user
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
        return new ErrorResponse(`Verify Your Email Please`, 403).renderErrorPage(res)
        // console.log(`Verify Email Please`)
    } else {
        next()
    }
})