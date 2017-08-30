module.exports = {

    AuthenticationFailed: function (message, status) {
        return {
            message: message || 'Authentication failed.',
            status: status || 401
        };
    },

    AuthorizationException: function (message, status) {
        return {
            message: message || 'Authorization failed.',
            status: status || 403
        }
    },

    BadRequest: function (message, status) {
        return {
            message: message || 'Bad request.',
            status: status || 400
        }
    },

    ResourceConflict: function (message, status) {
        return {
            message: message || 'Resource already exists.',
            status: status || 409
        }
    },

    ResourceNotFound: function (message, status) {
        return {
            message: message || 'Resource not found.',
            status: status || 404
        }
    },

    InternalServerException: function (message, status) {
        return {
            message: message || 'Internal server exception.',
            status: status || 500
        }
    }
};