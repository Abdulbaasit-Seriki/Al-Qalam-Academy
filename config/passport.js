const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const passport = require('passport')
const Class = require('../models/Class')

module.exports = () => {
	passport.use(new GoogleStrategy({
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: '/auth/google/callback'
	},
	async (accessToken, resfreshToken, profile, done) => {
		console.log(profile)
	}
	))

	passport.serializeUser((user, done) => {
		done(null, user.id)
	})
	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => done(err, user))
	})
}
