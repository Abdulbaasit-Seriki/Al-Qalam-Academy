const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const Teacher = require('../../models/Teacher')
const Student = require('../../models/Student')
const asyncErrorHandler = require('../../middlewares/asyncErrorHandler')
const ErrorResponse = require('../../middlewares/ErrorResponse')
const { validateDisplayName, validateClassName, validateMotto, handleValidationErrors, validatePassword, confirmPassword, validateEmail, checkUserExistence, checkDisplayName} = require('../../middlewares/validators')
const { sendCookieToken,  protectRoute, authorize} = require('../../middlewares/auth')
const { sendMail, verifyEmail } = require('../../utils/emails')

const router = express.Router()

// description     	Login with Google
// route			GET /auth/google
// Authorisation	Private
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

// description     	Google callback
// route			GET /auth/google/callback
// Authorisation	Private
router.get('/google/callback', passport.authenticate('google', {
	failureRedirect: '/login'
}), (req, res) => {   
	res.redirect('/dashboard')
})

// description     	Login page
// route			GET /auth/login
// Authorisation	Public
router.get('/login', (req, res) => {
	res.render('auth/users/login')
})


// description     	Register User
// route			POST /auth/user/signup
// Authorisation	Public
router.get('/teachers/signup', asyncErrorHandler(async (req, res, next) => {
	res.render('auth/users/signup', {errors: null})
}))

router.post('/teachers/signup',
 [validateDisplayName, validateEmail, validatePassword],
 handleValidationErrors('auth/users/signup'),
 asyncErrorHandler( async (req, res, next) => {
	const { firstName, lastName, displayName, emailAddress, password, gender, role } = req.body

	const teacher = await Teacher.create({
		firstName, lastName, displayName, emailAddress, password, gender, role
	})

	sendCookieToken(teacher, req)
	res.redirect(`/teachers/${teacher.id}`)
}))


// description     	Login A Teacher
// route			GET /auth/teacher/login
// Authorisation	Public
router.get('/teachers/login', asyncErrorHandler( async (req, res, next) => {
	res.render('auth/users/login', { errors: null, msg: null })
}))

// description     	Login A Teacher
// route			POST /auth/teacher/login 
// Authorisation	Public
router.post('/teachers/login', [validatePassword, checkUserExistence],
 handleValidationErrors('auth/users/login'),
 asyncErrorHandler( async (req, res, next) => {
	const teacher =  await Teacher.findOne({ displayName: req.body.displayName })
	sendCookieToken(teacher, req)

	res.redirect('/dashboard')
}))

// description     	Forgot Password
// route			POST /auth/forgotpassword
// Authorisation	Public
router.post('/forgotpassword', protectRoute, [checkDisplayName], asyncErrorHandler( async (req, res, next) => {
	const teacher = await Teacher.findOne({ displayName: req.body.displayName })

	const resetToken = teacher.getresetPasswordToken()
	console.log(resetToken)

	await teacher.save({ validateBeforeSave: false })
}))


// description     	Verify Email
// route			GET /auth/verifyemail/
// Authorisation	Private
router.get('/verifyemail', protectRoute, asyncErrorHandler( async (req, res, next) => {
	const teacher = await Teacher.findById(req.user.id)
	
	if (!teacher) {
		return next(new ErrorResponse(
            `Sorry Something went wrong`, 400)
            .renderErrorPage(res)
        )
	}
	await verifyEmail(teacher, req)
	res.send(`Check your email address for the verification link`)
}))


// description     	Verify Email
// route			GET /auth/verifyemail/:token
// Authorisation	Private
router.get('/verifyemail/:token', asyncErrorHandler( async (req, res, next) => {
	const decodedToken = jwt.verify(req.params.token, process.env.EMAIL_SECRET)
	let teacher = Teacher.findById(decodedToken.id)

	if (!teacher) {
		return next(new ErrorResponse(
            `Sorry Something went wrong`, 400)
            .renderErrorPage(res)
        )
	}

	teacher = await Teacher.findByIdAndUpdate(decodedToken.id, {isVerified: true}, {
		runValidators: true,
		new: true
	})

	res.send(`Email Verified`)
}))


module.exports = router