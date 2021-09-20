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
                callback(['dbUniqueConstraintError'])
                break;
            case AccessDeniedError:
                callback(['dbError'])
                break;
            case ConnectionAcquireTimeoutError:
                callback(['dbError'])
                break;
            case ConnectionRefusedError:
                callback(['dbError'])
                break;
            case ConnectionTimedOutError:
                callback(['dbError'])
                break;
            case HostNotFoundError:
                callback(['dbError'])
                break;
            case HostNotReachableError:
                callback(['dbError'])
                break;
            case InvalidConnectionError:
                callback(['dbError'])
                break;
            case ExclusionConstraintError:
                callback(['dbError'])
                break;
            case ForeignKeyConstraintError:
                callback(['dbForeignKeyConstraintError'])
                break;
            case UnknownConstraintError:
                callback(['dbError'])
                break;
            default:
                callback(['dbError'])
                break;
        }
    }

    return exports

}