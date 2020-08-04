const { createTransport } = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const jwt = require('jsonwebtoken')
const asyncErrorHandler = require('../middlewares/asyncErrorHandler')
const ErrorResponse = require('../middlewares/ErrorResponse')

const sendMail = asyncErrorHandler( async msg => {
    const options = {
        auth: {
            api_user: process.env.SENDGRID_USERNAME,
            api_key: process.env.SENDGRID_PASSWORD
          }
    }

    const client = createTransport(sendgridTransport(options))
    const email = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_MAIL}>`,
        to: msg.emails,
        subject: msg.subject,
        text: msg.text || null,
        html: msg.html
    }

    try {
        const info = await client.sendMail(email)
        console.log('Message sent: ' + info.response)
    } catch (error) {
        console.error(error)
        return next(new ErrorResponse(
            `Sorry Something went wrong, Email Couldn't Be Sent`, 501)
            .renderErrorPage(res)
        )
    }
   
}) 

const verifyEmail = asyncErrorHandler( async (user) => {
    const emailToken = jwt.sign({ id: user.id }, process.env.EMAIL_SECRET, {
        expiresIn: process.env.JWT_EXPIRY_DATE
    })

    const url = `${req.protocol}://${req.get('host')}/auth/verifyemail/${emailToken}`
    const msg = {
        emails: user.emailAddress,
        subject: `Confirm Your Email Address`,
        html: `
            <p>You are receiving this Email Because You signed up to Al-Qalam Academy.</p>
            <p>This link expires in the next 6 hours</p>
            <button><a href="${url}" target="blank">Click Here To Verify Your Email</a></button>
        `
    }

    await sendMail(msg)
})

module.exports = {
    sendMail, verifyEmail
}