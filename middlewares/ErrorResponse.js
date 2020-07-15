class ErrorResponse extends Error {
	constructor(message, statusCode) {
		super(message)
		this.statusCode = statusCode
	}

	renderErrorPage (res) {
		return res.render('errorPage', { msg: this.message, statusCode: this.statusCode })
	}

	redirect(res, templatePath, msg) {
		return res.render(templatePath, { msg })
	}
}

module.exports = ErrorResponse