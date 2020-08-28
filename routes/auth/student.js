const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const Student = require('../../models/Student')
const asyncErrorHandler = require('../../middlewares/asyncErrorHandler')
const ErrorResponse = require('../../middlewares/ErrorResponse')
const { handleValidationErrors, validatePassword, confirmPassword, validateAdmissionNumber, validateDOB, checkStudentExistence} = require('../../middlewares/validators')
const { sendCookieToken,  protectRoute, authorize} = require('../../middlewares/auth')

const router = express.Router()

// description     	Create A Student
// route			GET /auth/student/signup
// Authorisation	Public
router.get('/student/signup', asyncErrorHandler( async (req, res, next) => {
	res.render('auth/students/signup',  { errors: null })
}))

// description     	Create A Student
// route			POST /auth/student/signup
// Authorisation	Public
router.post('/student/signup', 
	[validateAdmissionNumber, validateDOB ,validatePassword, confirmPassword], 
	handleValidationErrors('auth/students/signup'), 
	asyncErrorHandler( async (req, res, next) => {
	const { className } = req.body
	const foundClass = await Class.findOne({ name: className })

	if (!foundClass) {
		return next(new ErrorResponse(`${className} Not Found`, 404).renderErrorPage(res))
	}
	req.body.className = foundClass._id

	const student = await Student.create(req.body)
	sendCookieToken(student, req)
}))

// description     	Login A Student
// route			GET /auth/student/login
// Authorisation	Public
router.get('/student/login', asyncErrorHandler( async (req, res, next) => {
	res.render('auth/students/login', { errors: null, msg: null })
}))

// description     	Login A Student
// route			POST /auth/student/login 
// Authorisation	Public
router.post('/teachers/login', [validatePassword, checkStudentExistence],
 handleValidationErrors('auth/users/login'),
 asyncErrorHandler( async (req, res, next) => {
	const teacher =  await Teacher.findOne({ displayName: req.body.displayName })
	sendCookieToken(student, req)

	res.redirect('/dashboard')
}))


module.exports = router