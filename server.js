let ENV = process.env.NODE_ENV;
let env = ENV || 'prod';
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let morgan = require('morgan');
let config = require('./config/' + env + '.json');
let mongoose = require('mongoose');
let jwt = require('jsonwebtoken');
let User = require('./controllers/models/user');

// Connect to database
mongoose.connect(config.database);

// Setup app variable
app.set('superSecret', config.secret);

// Setup app body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Setup logging
env == 'test' || app.use(morgan('combined'));

// Routes
app.get('/', (req, res) => {
    res.status(200).json({message: 'test'});
});

// Run server
app.listen(config.port);

console.log('Server running on port: ' + config.port);
console.log('Current enviroment: ' + env);
module.exports = app;