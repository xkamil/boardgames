let ENV = process.env.NODE_ENV;
let env = ENV || 'prod';

module.exports = require('./' + env + '.json');

