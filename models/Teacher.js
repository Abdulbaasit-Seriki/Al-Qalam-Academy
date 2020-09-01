const mongoose = require('mongoose')
const crypto = require('crypto')
const util = require('util')
const jwt = require('jsonwebtoken')
const scrypt = util.promisify(crypto.scrypt)

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
        minlength: 6,
        select: false
      },
      resetPasswordToken: Date,
      resetPasswordExpiration: Date,
      createdAt: {
        type: Date,
        default: Date.now,
      },
      isVerified: {
        type: Boolean,
        default: false
      }
})

// Encrypt Password
TeacherSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = crypto.randomBytes(10).toString('hex')
    const key = await scrypt(this.password, salt, 64);
	  this.password = `${key.toString('hex')}.${salt}`
  }
  else {
    next()
  }
})

// Assign JWT 
TeacherSchema.methods.assignJWT = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRY_DATE
	})
}

// Match User Credentilas and Password
TeacherSchema.methods.comparePasswords = async function (enteredPassword) {
  const [hashedPswrd, savedSalt] = this.password.split('.')

		const newHashBuffer = await scrypt(enteredPassword, savedSalt, 64)
		return hashedPswrd === newHashBuffer.toString('hex')
}

// Generate Password Token
TeacherSchema.methods.getresetPasswordToken = async function() {
  // Get Token
  const resetToken = crypto.randomBytes(20).toString('hex')

  // Hash tokjen and set to field
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

  // Set Expiry Date
  this.resetPasswordExpiration = Date.now() + 10 * 60 * 1000 //10 Days

  return resetToken
}

module.exports = mongoose.model('Teacher', TeacherSchema)