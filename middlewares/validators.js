const { check, validationResult } = require('express-validator')
const Teacher = require('../models/Teacher')
const ErrorResponse = require('./ErrorResponse')

module.exports = {
    validateName (nameParam) {
        check(nameParam)
        .trim()
        .withMessage(`Please Enter Your Name`)
    },
    validateEmail: check('email')
                    .trim()
                    .normalizeEmail()
                    .isEmail()
                    .withMessage(`Please add a Valid Email`)
                    .custom( async email => {
                        const teacher = await Teacher.findOne({ emailAddress: email })
                        if(teacher) {
                            throw new Error(`This Email Has been Picked, Kindly Enter Another One`)
                        }
                    }),
    validateClassName: check('className')
                    .trim()
                    .isLength({ min: 1, max: 20 })
                    .withMessage(`Name Must Be Between 1 and 20 characters`),
    validateMotto: check('motto')
                    .trim()
                    .isLength({ min: 10, max: 50 })
                    .withMessage(`Motto Should Be Between 10 and 40`),
    validatePassword: check('password')
                    .trim()
                    .isLength({ min: 6, max: 40 })
                    .withMessage(`Password Must Be Between 6 and 40 Characters`),
    confirmPassword: check('confirmPassword')
                    .trim()
                    .isLength({ min: 6, max: 40 })
                    .withMessage(`Password Must Be Between 6 and 40 Characters`)
                    .custom((confirmPassword, { req }) => {
                        if (confirmPassword !== req.body.password) {
                            throw new Error(`Passwords Must Match`)
                        }
                    }),
    handleValidationErrors (templatePath) {
        return (req, res, next) => {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.render(templatePath, { errors })
            }
            
            next()
        }
    }

}