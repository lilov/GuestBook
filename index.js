const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const feedbacks = require('./data');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
	res.render('pages/submit');
});

app.post('/submit', function(req, res) {
	let data = req.body;
	data.date = new Date().getTime();

	feedbacks.push(data);

	fs.writeFile('data.json', JSON.stringify(feedbacks), (err) => {
		if (err) throw err;
	});

	res.render('pages/submit-success');
});

app.get('/feedback', function(req, res) {
	var feedbacks = fs.readFileSync('data.json').toString();

	feedbacks = JSON.parse(feedbacks);

	feedbacks.forEach(function(feedback, index) {
		let date = new Date(feedback.date * 1000);
		feedbacks[index].date = `${date.getDate()}, ${date.getMonth()}, ${date.getFullYear() - 50350}`;
	});

	res.render('pages/feedback', {
		feedbacks: feedbacks
	});
});

app.listen(8080);
console.log('8080 is the magic port');
