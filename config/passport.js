const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const passport = require('passport')
const Teacher = require('../models/Teacher')
const asyncErrorHandler = require('../middlewares/asyncErrorHandler')

module.exports = (passport) => {
	passport.use(new GoogleStrategy({
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: '/auth/google/callback'
	},

	asyncErrorHandler( async (accessToken, resfreshToken, profile, callback) => {

		let teacher

		const newTeacher = {
			googleId: profile.id,
			displayName: profile.displayName,
			firstName: profile.name.givenName,
			lastName: profile.name.familyName,
			image: profile.photos[0].value,
			emailAddress: profile.emails[0].value,
			isVerified: profile.emails[0].verified
		}

		teacher =  await Teacher.findOne({ displayName: profile.displayName })

		if(teacher) {
			callback(null, teacher)
		} else {
			teacher = await Teacher.create(newTeacher)
			callback(null, teacher)
		}

	})
	))

	passport.serializeUser((user, done) => {
		done(null, user.id)
	})
	passport.deserializeUser((id, done) => {
		Teacher.findById(id, (err, user) => done(err, user))
	})
}
