const express = require('express')
const Class = require('../models/Class')
const asyncErrorHandler = require('../middlewares/asyncErrorHandler')
const ErrorResponse = require('../middlewares/ErrorResponse')
const studentsRouter = require('./student')
const { validateClassName, validateMotto, handleValiadtionErrors} = require('../middlewares/validators')

const router = express.Router()
   
// Reroute any query that has the following URL to the specified router
router.use('/:classSlug/students', studentsRouter)

// description     	Shows All Classes
// route			GET /class
// Authorisation	No
router.get('/', asyncErrorHandler( async (req, res, next) => {
	const classes = await Class.find().populate({
		path: 'students',
		select: 'admissionNumber, firstName, lastName'
	}).lean()
	
	res.render('class/index', { classes })
}))

// description     	Create new Class
// route			GET /class/create
// Authorisation	Yes
router.get('/create', asyncErrorHandler( async (req, res, next) => {
	res.render('class/create')
}))
 

// description     	Create new Class
// route			POST /class/create
// Authorisation	Yes
router.post('/create', [validateClassName, validateMotto], handleValiadtionErrors('class/create'), asyncErrorHandler(async (req, res, next) => {
	const newClass = await Class.create(req.body)
	res.redirect('/class')
}))

// description     	Show A Class
// route			GET /class/:slug
// Authorisation	No
router.get('/:slug', asyncErrorHandler( async (req, res, next) => {
	const foundClass = await Class.findOne({ slug: req.params.slug })

	// if (foundClass.length === 0) { 
	// 	return res.render('errorPage', {
	// 		msg: `Ooopps!!! Cannot Find Class ${req.params.slug}`,
	// 		statusCode: 404
	// 	})
	// }
  
	if (!foundClass) {
		return next(new ErrorResponse(`Ooopps!!! Cannot Find Class ${req.params.slug}`, 404).renderErrorPage(res))
	}
	res.render('class/class', { foundClass })

})) 

// description     	Edit Class
// route			GET /class/:slug/edit
// Authorisation	Yes
router.get('/:slug/edit', asyncErrorHandler( async (req, res, next) => {
	const foundClass = await Class.findOne({ slug: req.params.slug })

	if (!foundClass) {
		return next(new ErrorResponse(`Ooopps!!! Cannot Find Class ${req.params.slug}`, 404).renderErrorPage(res))
	}

	res.render('class/edit', { foundClass })
}))

// description     	Edit Class
// route			PUT /class/:slug/edit
// Authorisation	Yes
router.put('/:slug/edit', asyncErrorHandler( async (req, res, next) => {
	const updatedClass = await Class.findOneAndUpdate({ slug: req.params.slug}, req.body, {
		new: true,
		runValidator: true
	}).lean()

	res.redirect(`/class/${updatedClass.slug}`)
}))

module.exports = router