const {
    AccessDeniedError,
    UniqueConstraintError,
    ConnectionAcquireTimeoutError,
    ConnectionRefusedError,
    ConnectionTimedOutError,
    HostNotFoundError,
    HostNotReachableError,
    InvalidConnectionError,
    ExclusionConstraintError,
    ForeignKeyConstraintError,
    UnknownConstraintError
} = require('sequelize')

module.exports = function({}) {

    const exports = {}

    //     AccessDeniedError
    //     ConnectionAcquireTimeoutError
    //     ConnectionRefusedError
    //     ConnectionTimedOutError
    //     HostNotFoundError
    //     HostNotReachableError
    //     InvalidConnectionError
    //     ExclusionConstraintError
    //     ForeignKeyConstraintError
    //     TimeoutError
    //     UnknownConstraintError


    exports.checkError = function(error, callback) {

        switch (error.constructor) {
            case UniqueConstraintError:
                callback(['dbConstraintError'])
                break;
            case AccessDeniedError:
                callback(['dbAccessDeniedError'])
                break;
            case ConnectionAcquireTimeoutError:
                callback(['dbConnectionAcquireTimeoutError'])
                break;
            case ConnectionRefusedError:
                callback(['dbConnectionRefusedError'])
                break;
            case ConnectionTimedOutError:
                callback(['dbConnectionTimedOutError'])
                break;
            case HostNotFoundError:
                callback(['dbHostNotFoundError'])
                break;
            case HostNotReachableError:
                callback(['dbHostNotReachableError'])
                break;
            case InvalidConnectionError:
                callback(['dbInvalidConnectionError'])
                break;
            case ExclusionConstraintError:
                callback(['dbExclusionConstraintError'])
                break;
            case ForeignKeyConstraintError:
                callback(['dbForeignKeyConstraintError'])
                break;
            case UnknownConstraintError:
                callback(['dbUnknownConstraintError'])
                break;
            default:
                callback(['dbInternalError'])
                break;
        }
    }

    return exports

}