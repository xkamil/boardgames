module.exports.AuthenticationFailed = function (message, status, statusCode) {
    let error = {};

    error.message = message || 'Authorization failed.';
    error.status = status || 401;
    if (statusCode) error.statusCode = statusCode;

    return error;
};

module.exports.BadRequest = function (message, status, statusCode) {
    let error = {};

    error.message = message || 'Bad request.';
    error.status = status || 400;
    if (statusCode) error.statusCode = statusCode;

    return error;
};

module.exports.ResourceConflict = function (message, status, statusCode) {
    let error = {};

    error.message = message || 'Resource already exists.';
    error.status = status || 409;
    if (statusCode) error.statusCode = statusCode;

    return error;
};

module.exports.ResourceNotFound = function (message, status, statusCode) {
    let error = {};

    error.message = message || 'Resource not found.';
    error.status = status || 404;
    if (statusCode) error.statusCode = statusCode;

    return error;
};