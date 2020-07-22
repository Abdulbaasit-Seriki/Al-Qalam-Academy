const express = require('express')
const passport = require('passport')
const Teacher = require('../models/Teacher')
const Student = require('../models/Student')
const asyncErrorHandler = require('../middlewares/asyncErrorHandler')
const ErrorResponse = require('../middlewares/ErrorResponse')
const { validateDisplayName,validateClassName, validateMotto, handleValidationErrors, validatePassword, confirmPassword, validateEmail, checkUserExistence} = require('../middlewares/validators')
const { sendCookieToken,  protectRoute, authorize} = require('../middlewares/auth')

const router = express.Router()

// description     	Login with Google
// route			GET /auth/google
// Authorisation	Private
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

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
	res.render('auth/login')
})

// description     	Create A Student
// route			GET /auth/student/signup
// Authorisation	Public
router.get('/student/signup', asyncErrorHandler( async (req, res, next) => {
	res.render('auth/students/signup')
}))

// description     	Create A Student
// route			POST /auth/student/signup
// Authorisation	Public
router.post('/student/signup', 
	[validatePassword, confirmPassword], 
	handleValidationErrors('auth/student/signup'), 
	asyncErrorHandler( async (req, res, next) => {
	const { className } = req.body
	const foundClass = await Class.findOne({ name: className })

	if (!foundClass) {
		return next(new ErrorResponse(`${className} Not Found`, 404).renderErrorPage(res))
	}
	req.body.className = foundClass._id

	const student = await Student.create(req.body)
	res.redirect(`/students/${student.admissionNumber}`)
}))

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
	const token = teacher.assignJWT()
	console.log(token)
	res.redirect(`/teachers/${teacher.id}`)
}))

// description     	Login A Teacher
// route			POST /auth/teacher/login
// Authorisation	Public
router.post('/teachers/login', [checkUserExistence], asyncErrorHandler( async (req, res, next) => {
	const token = teacher.assignJWT()
	console.log(token)
	res.redirect(`/teachers/${teacher.id}`)
}))

router.get('/teachers/me', protectRoute, asyncErrorHandler( async (req, res, next) => {
	const user = Teacher.findById(req.user.id)
}))

module.exports = router