const { check, validationResult } = require('express-validator')
const Teacher = require('../models/Teacher')
const Student = require('../models/Student')
const ErrorResponse = require('./ErrorResponse')

const validateDisplayName = () => {
    check('displayName')
    .trim()
    .isLength({ min: 3, max: 15 })
    .withMessage(`Please Enter Your Username`)
    .custom( async displayName => {
        const teacher = await Teacher.findOne({ displayName })
        if (teacher) {
            throw new Error(`This Username Has been Selected, Kindly Pick Another`)
        }
    })
}

const validateEmail = () => {
    check('emailAddress')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage(`Please add a Valid Email`)
    .custom( async emailAddress => {
        const teacher = await Teacher.findOne({ emailAddress })
        if(teacher) {
            throw new Error(`This Email Has been Picked, Kindly Enter Another One`)
        }
    })
} 

const validateClassName = () => {
    check('name')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage(`Name Must Be Between 1 and 20 characters`)
}

const validateMotto = () => {
    check('motto')
    .trim()
    .isLength({ min: 10, max: 50 })
    .withMessage(`Motto Should Be Between 10 and 40`)
} 

const validatePassword = () => {
    check('password')
    .trim()
    .isLength({ min: 6, max: 40 })
    .withMessage(`Password Must Be Between 6 and 40 Characters`)
}

const confirmPassword = () => {
    check('confirmPassword')
    .trim()
    .isLength({ min: 6, max: 40 })
    .withMessage(`Password Must Be Between 6 and 40 Characters`)
    .custom((confirmPassword, { req }) => {
        if (confirmPassword !== req.body.password) {
            throw new Error('Password confirmation does not match password');
            }
    })
}

const handleValidationErrors =  (templatePath) => {
    return (req, res, next) => {
        const errors = validationResult(req)   

        if (!errors.isEmpty()) {
            return res.render(templatePath, { errors, msg: null })
        }
        
        next()
    }
}

const checkUserExistence = () => {
    check('displayName')
    .trim()
    .isLength({ min: 3, max: 15 })
    .withMessage(`Please Enter Your Username`)
    .custom( async (displayName, { req }) => {
        const teacher =  await Teacher.findOne({ displayName }).select('+password')
        if(!teacher) {
            throw new Error(`Username and Password Don't Match`)
        }

        const isMatch = await teacher.comparePasswords(req.body.password)

        if(!isMatch) {
            throw new Error(`Username and Password Don't Match`)
        }
    })
}

const checkDisplayName = () => {
    check('displayName')
    .trim()
    .isLength({ min: 3, max: 15 })
    .withMessage(`Please Enter Your Username`)
    .custom( async displayName => {
        const teacher = await Teacher.findOne({ displayName })
        if (!teacher) {
            throw new Error(`Username does not Exist`)
        }
    })
}

const validateAdmissionNumber = () => {
    check('admissionNumber')
    .trim()
    .isInt()
    .isLength({ min: 3, max: 4 })
    .withMessage(`Please Enter Your Admission Number`)
}

const checkAdmissionNum = () => {
    check('admissionNumber')
    .trim()
    .isInt()
    .isLength({ min: 3, max: 4 })
    .withMessage(`Please Enter Your Admission Number`)
    .custom( async admissionNumber => {
        const student = await Student.findOne({ admissionNumber })
        if (!student) {
            throw new Error(`Student does not Exist`)
        }
    })
} 

module.exports = {
    validateDisplayName,
    validateEmail,
    validateClassName,
    validateMotto,
    validatePassword,
    confirmPassword,
    checkUserExistence,
    checkDisplayName,
    validateAdmissionNumber,
    checkAdmissionNum,
    handleValidationErrors   
}