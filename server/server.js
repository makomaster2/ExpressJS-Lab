const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ encoded: false }));

app.use((req, res, next) => {
	console.log(req.originalUrl);
	next();
});

app.post('/contact-form', (req, res) => {
	console.log(req.body);

	// 1. Array defined inside so it resets on POST and
	// doesn't duplicate when we readFile and push fileData
	let arr = [];

	// 2. Added {encoding: 'UTF-8'} to get convert from Buffer
	fs.readFile('log.json', { encoding: 'UTF-8' }, (err, fileData) => {
		if (err) console.log(err);

		// 3. If we have data, then parse it
		if (fileData) {
			let fileChirps = JSON.parse(fileData);
			// 4. Add this data to the array so we don't lose it
			fileChirps.forEach(chirp => arr.push(chirp));
		}

		// 5. Add the new chirp to the array
		arr.push(req.body);
		// 6. Write array to the file
		fs.writeFile('log.json', JSON.stringify(arr), err => console.log(err));
	});

	res.send('Thank you for your chirp!');
});

// app.get('/', (req, res) => {
// 	res.send('Hello from the web server side...');
// });

app.use(express.static(path.join(__dirname, '../public')));

app.listen(3000);
