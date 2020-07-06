const ErrorResponse = require('./ErrorResponse')

const errorHandler = (err, req, res, next) => {
	let error = { ...err }
	error.message = err.message

	console.error(err)

	// If the ID of the resource provided is wrong
	if (err.name === "CastError") {
		const message = `Bootcamp not found with an id of ${err.value}`
		error = new ErrorResponse(message, 404)
	}

	// If there's a duplicate key
	if (err.code === 11000) {
		const message = `Duplicate key entered`
		error = new ErrorResponse(message, 400).renderErrorPage(req, res)
	}

	// Mongoose Validation Error
	if (err.name === "ValidationError") {
		const message = Object.values(err.error).map(value => value.message)
		error = new ErrorResponse(message, 400).renderErrorPage(req, res)
	}

	res.status(error.statusCode || 500).render('error', {
		msg: error.message || `Server Error`,
		statusCode: error.statusCode
	})
}

module.exports = errorHandler