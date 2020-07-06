class ErrorResponse extends Error {
	constructor(message, statusCode) {
		super(message)
		this.statusCode
	}

	renderErrorPage (res) {
		return res.render('errorPage', { msg: this.message, statusCode: this.statusCode })
	}
}

module.exports = ErrorResponse