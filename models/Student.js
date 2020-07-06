const mpngoose = require('mongoose')

const StudentSchema = new mongoose.Schema({
	admissionNumber: {
		required: true,
		type: Number
	}
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
	}
	address: String,
	class: {
    type: mongoose.Schema.ObjectId,
    ref: 'Class',
    required: true
  }
})

module.exports = mongoose.model('Student', StudentSchema)