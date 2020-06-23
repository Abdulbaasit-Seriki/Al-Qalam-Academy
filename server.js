const express = require('express');
const app = express();

// Midddlewares
app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile('/index.html', { root: path.join(__dirname, './public') }, err => {
		err ? next(err) : console.log(`File Sent`);
	})
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on ${port}`));
