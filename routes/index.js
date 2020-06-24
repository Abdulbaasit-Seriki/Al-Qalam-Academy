// This file is for top level routes 
const path = require('path')
const express = require('express')
const router = express.Router()

// description     	Landing Page
// route			GET /
// Authorisation	Public
router.get('/', (req, res) => {
	res.sendFile('/index.html', { root: path.join(__dirname, './public') }, err => {
		err ? next(err) : console.log(`File Sent`)
	})
})


module.exports = router