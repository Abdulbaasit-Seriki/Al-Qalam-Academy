const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const passport = require('passport')
const session = require('express-session')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const methodOverride = require('method-override')
const MongoStore = require('connect-mongo')(session)

const connectToDB = require('./config/database')
const errorHandler = require('./middlewares/error.js');


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
app.use(methodOverride('_method'))
app.use(errorHandler)


// Body Parser 
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// EJS 
app.set("view engine", "ejs")

const options = {
	secret: process.env.SESSION_SECRET,
	name: process.env.SESSION_NAME,
	cookie: {
		maxAge: 1000 * 60 * 30
	},
	resave: false,
	saveUninitialized: false
}

if (process.env.NODE_ENV = 'production') {
	options.secure = true
}

// Express Sessions
app.use(session({
	...options,
	store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

// Passport Middleware
app.use(passport.initialize()) 
app.use(passport.session())


// Routes
const indexRoutes = require('./routes/index')
const teachersAuthRoute = require('./routes/auth/teacher')
const studentsAuthRoute = require('./routes/auth/student')
const classRoute = require('./routes/class')
const studentsRoute = require('./routes/student')
const teachersRoute = require('./routes/teacher')

// Mount Routers 
app.use('/', indexRoutes)
app.use('/auth', teachersAuthRoute, studentsAuthRoute)
app.use('/class', classRoute)
app.use('/students', studentsRoute)
app.use('/teachers', teachersRoute)


const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`))
