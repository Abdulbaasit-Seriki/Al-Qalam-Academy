// const express = require('express');
// const app = express();

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {

	let filePath = '.' + req.url;
	if (filePath == './') {
		filePath = './index.html';
	}

	const extName = path.extname(filePath);
	let contentType = 'text/html';

	switch (extName) {
		case '.js': 
			contentType = 'text/javascript';
			break;
		case '.css': 
			contentType = 'text/css';
			break;
		case '.json': 
				contentType = 'application/json';
				break;
	}

	fs.readFile(filePath, (err, data) => {
			if (err) {
				res.writeHead(404);
				res.write(`eroooor`);
				res.end();
			} else {
				res.writeHead(200, {"Content-Type": contentType});
				res.write(data, "utf-8");
				res.end();
			}
	});
});

const port = process.env.PORT || 3000;
// app.listen(port, () => console.log(`Server running on ${port}`));
server.listen(port, () => console.log(`Server running on port ${port}`));