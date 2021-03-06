let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let partials = require('express-partials')
const spineRouter = require('./routes/api/spines.js');
const generalRouter = require('./routes/api/general.js');
const infoRouter = require('./routes/info/info.js');
const siteMapRouter = require('./routes/api/sitemap.js');
const simulatorRouter = require('./routes/simulate/simulate.js');

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use('/static', express.static(__dirname + '/static'));
app.use(partials())
app.use("/spines", spineRouter);
app.use("/general", generalRouter);
app.use("/info", infoRouter);
app.use("/sitemap", siteMapRouter);
app.use("/simulator", simulatorRouter);

app.disable('x-powered-by');

app.get("/.*/", (req, res, next) => {
    console.log(req.get("x-forwarded-for"));
    next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', {
        error: err
    });
});

module.exports = app;