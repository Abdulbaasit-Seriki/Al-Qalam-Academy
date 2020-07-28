const express = require('express')
const Teacher = require('../models/Teacher')
const asyncErrorHandler = require('../middlewares/asyncErrorHandler')
const ErrorResponse = require('../middlewares/ErrorResponse')
const { protectRoute, logOut } = require('../middlewares/auth')

const router = express.Router()
// description     	Get A Teacher
// route			GET /auth/teacher/login
// Authorisation	Public
router.get('/:id', asyncErrorHandler( async (req, res, next) => {
    const teacher = await Teacher.findById(req.params.id)
    
    if (!teacher) {
        return next(
            new ErrorResponse(`Sorry!!! The teacher with ${req.params.id} cannot be found`, 404)
			.renderErrorPage(res)
        )
    }

    res.status(200).json({
        teacher
    })
}))

router.get('/me', protectRoute, asyncErrorHandler( async (req, res, next) => {
	const teacher = req.user;

	res.status(200).json({
	  data: teacher
	});
}))

router.get('/:id/logout',  protectRoute, asyncErrorHandler( async (req, res, next) => {
    const teacher = await Teacher.findById(req.params.id)
    
    if (!teacher) { 
        return next(
            new ErrorResponse(`Sorry!!! The teacher with ${req.params.id} cannot be found`, 404)
			.renderErrorPage(res)
        )
    } 
    
    req.session.destroy( err => {
        if (err) {
            console.error(err)
        }  
    })

    res.clearCookie(process.env.SESSION_NAME)
	res.redirect('/')
}))    

module.exports = router