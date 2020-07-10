const mpngoose = require('mongoose')

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
	}
	address: String,
	className: {
    type: mongoose.Schema.ObjectId,
    ref: 'Class',
    required: true
  }
})

module.exports = mongoose.model('Student', StudentSchema)