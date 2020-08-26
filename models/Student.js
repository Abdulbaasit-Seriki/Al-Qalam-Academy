const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

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

StudentSchema.methods.assignJWT = function() {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRY_DATE
	})
}

module.exports = mongoose.model('Student', StudentSchema)