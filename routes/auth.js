const express = require('express')
const passport = require('passport')

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


module.exports = router