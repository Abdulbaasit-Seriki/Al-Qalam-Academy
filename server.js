const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const passport = require('passport')
const session = require('express-session')
const bodyParser = require('body-parser')

const connectToDB = require('./config/database')

// Load Config files
dotenv.config({ path: './config/config.env' })

// Passport Configuration
require('./config/passport')(passport)

const app = express()
connectToDB()

// Morgan setup, Logging
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'))
}

// Midddlewares
app.use(express.static('public'))

// EJS 
app.set("view engine", "ejs")

// Express Sessions
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: false
}))

// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const indexRoutes = require('./routes/index')
const authRoute = require('./routes/auth')
const classRoute = require('./routes/class')

// Mount Routers
app.use('/', indexRoutes)
app.use('/auth', authRoute)
app.use('/class', classRoute)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`))
