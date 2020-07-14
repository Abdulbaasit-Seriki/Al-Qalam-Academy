const express = require('express')
const Class = require('../models/Class')
const Student = require('../models/Student')
const asyncErrorHandler = require('../middlewares/asyncErrorHandler')
const ErrorResponse = require('../middlewares/ErrorResponse')

const router = express.Router()

// description     	Shows All Students or all students per class
// route			GET /class/:classSlug/student
// route 			GET /student
// Authorisation	No
router.get('/', asyncErrorHandler( async (req, res, next) => {
	let query

	if (req.params.classSlug) {
		const foundClass = await Class.findOne({ slug: req.params.classSlug })
		if (!foundClass) {
			return next(new ErrorResponse(`Oooops!! ${req.params.classSlug} Not Found`, 404).renderErrorPage(res))
		}
 
		query = Student.find({ className: foundClass._id })
	}
	else {
		query = Student.find().populate({
			path: 'className',
			select: 'name motto'
		})
	}

	const students = await query
	res.render('students/index', { students })
}))

// description     	Shows A Student
// route 			GET /:admissionNum
// Authorisation	No
router.get('/:admissionNum', asyncErrorHandler( async (req, res, next) => {
	const student = await Student.findOne({ admissionNumber: req.params.admissionNum }).populate({
		path: 'className',
		select: 'name motto'
	}).lean()
	console.log(student)
	res.render('students/student', { student })
}))

// description     	Edit A Student
// route 			GET /:admissionNum/edit
// Authorisation	Yes
router.get('/:admissionNum/edit', asyncErrorHandler( async (req, res, next) => {
	const student = await Student.findOne({ admissionNumber: req.params.admissionNum })

	if (!student) {
		return next(new ErrorResponse(`Sorry!!! The Student with Admission Number ${req.params.admissionNum} cannot be found`, 404)
			.renderErrorPage(res))
	}

	res.render('students/edit', { student })
}))

// description     	Edit A Student
// route 			PUT /:admissionNum/edit
// Authorisation	Yes
router.get('/:admissionNum/edit', asyncErrorHandler( async (req, res, next) => {
	const { className } = req.body
	const foundClass = await Class.findOne({ name: className })
	if (!foundClass) {
		return next(new ErrorResponse(`${className} Not Found`, 404).renderErrorPage(res))
	}
	req.body.className = foundClass._id

	const student = await Student.findOneAndUpdate({ admissionNumber: req.params.admissionNum }, req.body)
	res.redirect(`/students/${student.admissionNumber}`)
}))

module.exports = router
   