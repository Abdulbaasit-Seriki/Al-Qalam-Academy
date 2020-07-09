const mongoose = require('mongoose')
const slugify = require('slugify')

const ClassSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, `Please, What's the name of your class`],
		unique: true,
		trim: true,
		maxlength: [40, `Name cannot be more than 40 characters`]
	},
	slug: String,
	motto: {
		type: String,
		required: [true, `Please Add A Suitable Motto`],
		maxlength: [100, `Motto cannot be more than 100 characters`]
	},
	subjects: [String]
}, {
	toJSON: { virtuals: true },
	toObject: { virtuals: true }
}) 

ClassSchema.pre("save", function(next){
	this.slug = slugify(this.name.toLowerCase())
	next()
})

// ClassSchema.pre('findOneAndUpdate', async function(next) {
// 	const docToUpdate = await this.model.findOne(this.getQuery());
//   	console.log(this); // The document that `findOneAndUpdate()` will modify
//   	// docToUpdate.slug = slugify(name.toLowerCase())
//   	// next()
// });

// List all the students per class
ClassSchema.virtual('students', { 
	ref: 'Student',
	localField: '_id', 
	foreignField: 'class',
	justOne: false
})

module.exports = mongoose.model('Class', ClassSchema)

