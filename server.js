let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let morgan = require('morgan');
let config = require('./config/config');
let mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connect to database
mongoose.connect(config.database);

// Setup app variable
app.set('superSecret', config.secret);

// Setup app body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Setup logging
config.env == 'test' || app.use(morgan('dev'));

// Routes

// # Authentication
let authRouter = require('./controllers/routes/authentication');
app.use(authRouter);

// # Authorization middleware
let authorizationRouter = require('./controllers/middleware/authorization');
app.use(authorizationRouter);

// # Users
let usersRouter = require('./controllers/routes/users');
app.use('/users', usersRouter);

// # Tags
let tagsRouter = require('./controllers/routes/games');
app.use('/tags', tagsRouter);

// # Places
let placesRouter = require('./controllers/routes/places');
app.use('/places', placesRouter);

// # Error handler
let errorHandlerRouter = require('./controllers/middleware/error_handler');
app.use(errorHandlerRouter);

// Run server
app.listen(config.port);

console.log('Server running on port: ' + config.port);
console.log('Current enviroment: ' + config.env);
module.exports = app;