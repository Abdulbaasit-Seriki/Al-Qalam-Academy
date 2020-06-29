const express = require('express')
const Class = require('../models/Class')

const router = express.Router()
let error;

// description     	Show All Classes
// route			GET /class
// Authorisation	Public
router.get('/', async (req, res) => {
	try {
		const classes = await Class.find();
		res.status(200).render('class/index', { classes })
	}
	catch(err) {
		return res.status(404).render('class/index', { error: err })
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


module.exports = router