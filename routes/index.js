// This file is for top level routes 
const path = require('path')
const express = require('express')
const router = express.Router()
const { protectRoute } = require('../middlewares/auth')

// description     	Landing Page
// route			GET /
// Authorisation	Public
router.get('/', (req, res) => {
	res.sendFile('/index.html', { root: path.join(__dirname, './public') }, err => {
		err ? next(err) : console.log(`File Sent`)
	})
})

// description     	Dashboard
// route			GET /dashboard
// Authorisation	Private
router.get('/dashboard', protectRoute, (req, res) => {
	const user = req.user
	res.render('dashboard', { user })
})


module.exports = router