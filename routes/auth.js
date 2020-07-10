const express = require('express')
const passport = require('passport')
const Class = require('../models/Class')
const Student = require('../models/Student')
const asyncErrorHandler = require('../middlewares/asyncErrorHandler')
const ErrorResponse = require('../middlewares/ErrorResponse')

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
router.post('/student/signup', asyncErrorHandler( async (req, res, next) => {
	const { className } = req.body
	const foundClass = await Class.findOne({ name: className })

	if (!foundClass) {
		return next(new ErrorResponse(`${className} Not Found`, 404).renderErrorPage(res))
	}
	req.body.className = foundClass._id

	const student = await Student.create(req.body)
	res.redirect(`/students/${student.admissionNumber}`)
}))

module.exports = router