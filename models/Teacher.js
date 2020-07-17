const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const TeacherSchema = new mongoose.Schema({
    googleId: {
        type: String,
      },
      displayName: {
        type: String,
        required: true,
      },
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      image: {
        type: String,
      },
      gender: {
        type: String,
        enum: ['Male', 'Female']
      },
      emailAddress: {
          type: String,
          unique: true,
          required: [true, `Please add an Email Address`],
          match:  [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
      },
      role: {
        type: String,
        enum: ['subjectTeacher', 'classTeacher'],
        default: 'classTeacher'
      },
      password: {
        type: String,
        unique: true,
        required: true,
        minlength: 6,
        select: false
      },
      resetPasswordToken: Date,
      resetPasswordExpiration: Date,
      createdAt: {
        type: Date,
        default: Date.now,
      },
})

// Encrypt Password
TeacherSchema.pre('save', async function (next) {
	const salt = await bcrypt.genSalt(10)
	this.password = bcrypt.hash(this.password, salt)
	next()
})

// Assign JWT
TeacherSchema.methods.assignJWT = function () {
	return jwt.sign({ id: this_id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRY_DATE
	})
}

module.exports = mongoose.model('Teacher', TeacherSchema)