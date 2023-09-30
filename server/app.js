var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

console.log("in server.js");
mongoose.connect('mongodb+srv://mongo:BhYSvmZJmN1ERVgO@cmsc447.ymkauhy.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
  
}, (err) => {
  console.log("in mongoose.connect");
  if (!err) {
    console.log('MongoDB Connection Succeeded.');
  } else {
    console.log('Error in DB connection : ' + err);
  }
});

var db = mongoose.connection;
console.log("line 25 w/ mongoose.connection value of =");
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("line 28 in db.once('', function(){})");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
console.log("line 48");
app.use(express.static(__dirname + '/views'));

console.log("line 51");
var index = require('./routes/api/userRoutes'); 
console.log("line 53");
app.use('/', index);
console.log("line 54");

console.log("line 56");
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

console.log("line 64");
// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

console.log("line 72");
const PORT = process.env.PORT || 3005;
app.listen(PORT, function () {
  console.log('Server is started on http://127.0.0.1:'+PORT);
});

