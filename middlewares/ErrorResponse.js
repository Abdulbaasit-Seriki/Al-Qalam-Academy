class ErrorResponse extends Error {
	constructor(message, statusCode) {
		super(message)
		this.statusCode = statusCode
	}

	renderErrorPage (res) {
		return res.render('errorPage', { msg: this.message, statusCode: this.statusCode })
	}

	redirect(res, templatePath, msg = this.message) {
		return res.render(templatePath, { msg, errors: null })
	}
}

module.exports = ErrorResponse