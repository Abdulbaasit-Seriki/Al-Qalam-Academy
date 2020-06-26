const mongoose = require('mongoose')
const dns = require('dns').promises;

const checkInternet = async () => {
	try {
		return await dns.lookup('google.com')
	}
	catch(err) {
		return false;
	}
};

 // return dns.lookup('google.com')
 //        .then(() => true)
 //        .catch(() => false);

const connectToDB = async () => {
	try {
		let uri = process.env.NODE_ENV === 'development' && !checkInternet() 
		? 'mongodb://localhost:27017/al-qalam' : process.env.MONGO_URI
		
		const connect = await mongoose.connect(uri, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true
		})

		console.log(`MongoDB connected: ${connect.connection.host}`)
	}
	catch(err) {
		console.error(err)
		process.exit(1) 
	}
}

module.exports = connectToDB;