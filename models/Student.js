const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const util = require('util')
const scrypt = util.promisify(crypto.scrypt)

const StudentSchema = new mongoose.Schema({
	admissionNumber: {
		required: true,
		unique: true,
		type: Number
	},
	firstName: {
		required: true,
		type: String
	},
	lastName: {
		required: true,
		type: String
	},
	middleName: {
		required: true,
		type: String
	},
	DOB: {
		required: true,
		type: Date
	},
	gender:{
		type: String,
		enum: ['Male', 'Female', 'Binary']
	},
	password: String,
	address: String,
	className: {
    type: mongoose.Schema.ObjectId,
    ref: 'Class',
    required: true
  }
})

StudentSchema.pre('save', async function (next) {
	if(this.isModified('password')) {
		const salt = crypto.randomBytes(10)
		const key = await scrypt(this.password, salt, 64)
		this.password = `${key.toString('hex')}.${salt}`
	}
	else {
		next()
	}
})

StudentSchema.methods.assignJWT = function() {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRY_DATE
	})
}

StudentSchema.methods.comparePasswords =  async function(receivedPassword) {
	const [hashedPassword, savedSalt] = this.password.split('.')

	const receivedPasswordHash = await scrypt(receivedPassword, savedSalt, 64)
	return receivedPasswordHash.toString('hex') === hashedPassword
}

module.exports = mongoose.model('Student', StudentSchema)