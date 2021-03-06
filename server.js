var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var port = 1337;
var app = express();
var mysql = require('mysql');
var redis = require('redis');
const arr = ['星期日', '星期一','星期二','星期三','星期四','星期五','星期六'];
var db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	port: 3306,
	password: '123456',
	database: 'work'
});
const html_dir = __dirname + "/views/";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
    else  next();
});

app.get("/workingList", function (req, res) {
	db.query("SELECT * from working_calendar", function (err, rows) {
		res.send(rows);
	});
});

app.get("/work", function (req, res) {
	let date =  req.query.date;
		console.log(date)

	db.query("SELECT * from working_calendar where date = ?", [date], function (err, rows) {
		res.send(rows[0]);
	});
});

app.get("/add", function (req, res) {
	res.sendFile(html_dir + "add.html");
});

app.post("/work", function (req, res) {
	const day = getDay();
	const today = getToday();
	const {hworktime, price, morning, afternoon, evening, summary} = req.body;
	db.query("insert into working_calendar (date, day," +
	" hworktime, price, morning, afternoon, evening, summary) values(?, ?, ?, ?, ?, ?, ?, ?)",
	[today, day, hworktime, price, morning, afternoon, evening, summary],function (err, rows) {
		if(err) console.log(err);
		res.redirect("/");
	});
});

app.delete("/work", function (req, res){
	const today = getToday();
	db.query("delete from working_calendar where date = ?",
	[today], function (err, rows) {
		if(err) console.log(err);
		res.redirect("/");
	});
});

function getToday(){
	const date = new Date();
	const today = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
	return today;
}

function getDay(){
	const date = new Date();
	const day = arr[date.getDay()];
	return day;
}

var server = app.listen(8000, function () {
var host = server.address().address;
var port = server.address().port;

  console.log('my app listening at http://%s:%s', host, port);
});