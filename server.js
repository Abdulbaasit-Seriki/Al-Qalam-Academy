const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectToDB = require('./config/database')

// Load Config files
dotenv.config({ path: './config/config.env' })

const app = express()
// connectToDB()

// Morgan setup, Logging
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'))
}

// Midddlewares
app.use(express.static('public'))

// EJS 
app.set("view engine", "ejs")

// Routes
const indexRoutes = require('./routes/index')

// Mount Routers
app.use('/', indexRoutes)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`))
