const path = require('path')
const express = require('express')
const dotenv = require('dotenv')

const connectToDB = require('./config/database')

// Load Config files
dotenv.config({ path: './config/config.env' })

const app = express()
// connectToDB()

// Midddlewares
app.use(express.static('public'))

app.get('/', (req, res) => {
	res.sendFile('/index.html', { root: path.join(__dirname, './public') }, err => {
		err ? next(err) : console.log(`File Sent`)
	})
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`))
