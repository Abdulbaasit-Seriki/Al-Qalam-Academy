const mongoose = require('mongoose')

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
      createdAt: {
        type: Date,
        default: Date.now,
      },
})

module.exports = mongoose.model('Teacher', TeacherSchema)