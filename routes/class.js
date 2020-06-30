const express = require('express')
const Class = require('../models/Class')

const router = express.Router()
let error;

// description     	Show All Classes
// route			GET /class
// Authorisation	Public
router.get('/', async (req, res) => {
	try {
		const classes = await Class.find()
		console.log(classes)
		res.status(200).render('class/index', { classes })
	}
	catch(err) {
		return res.status(404).render('class/index', { error: err })
	}
})

// description     	Show A Partiuclar Class
// route			GET /class/:slug
// Authorisation	Public
router.get('/:slug', async (req, res) => {
	try {
		const foundClass = await Class.find({ slug: req.params.slug });
		res.status(200).render('class/class', { foundClass })
	}
	catch(err) {
		console.log(err)
		return res.status(404).redirect('back')
	}
})

// description     	Create a Class
// route			GET /class/new
// Authorisation	Private
router.get('/create', (req, res) => {
	res.render('class/new', { error: null })
})
 
// description     	Create a Class
// route			POST /class/create
// Authorisation	Private
router.post('/create', async (req, res) => {
	req.body.subjects = req.body.subjects.split(',')
	try {
		const newClass = await Class.create(req.body)
		res.status(201).redirect('/class')
	}
	catch(err) {
		return res.status(400).render('/class/new', { error: err })
	}
	
})

// description     	Update a Class
// route			GET /class/:slug/update
// Authorisation	Private
router.get('/:slug/update', async (req, res) => {

	try {
		const foundClass = await Class.find({ slug: req.params.slug })
		res.status(200).render('class/update', { foundClass: foundClass, error: null})
	}
	catch(err) {
		return res.status(404).redirect('back')
	}
})

// description     	Update a Class
// route			POST /class/:slug/update
// Authorisation	Private
router.put('/:slug/update', async (req, res) => {

	try {
		const foundClass = await Class.find({ slug: req.params.slug });
		const param = foundClass._id
		console.log(param)

		const updatedClass = await Class.findByIdAndUpdate(param, req.body, {
			new: true,
			runValidator: true
		})

		res.status(200).redirect(`/class/${updatedClass.slug}`)
	}
	catch(err) {
		return res.status(404).redirect('back')
	}
})


module.exports = router