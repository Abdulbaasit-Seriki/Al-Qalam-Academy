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

		query = Student.find({ class: foundClass._id )}
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
	res.render('students/student', { student })
}))


module.exports = router
   