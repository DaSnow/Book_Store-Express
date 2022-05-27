global.express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const conn = require('./data/server.js');
global.conn = require('./data/server.js');

var app = express();

conn.connect(error => {
    console.log(!error ? "Database Connected" : "Connection Failed");
});

app.listen(process.env.PORT || 3000);

// view engine setup
app.set('views', path.join(__dirname, '/views/pages'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index.js'));
app.use('/books', require('./routes/books.js'));
app.use('/customers', require('./routes/customers.js'));

module.exports = app;