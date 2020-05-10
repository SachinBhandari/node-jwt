const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const routes = require('./routes');

require('./services/mongo');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json({ limit: '300kb' }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  res.status(err.status || 500).json({
    error: true,
    status: err.status || 500,
  });
});

module.exports = app;
