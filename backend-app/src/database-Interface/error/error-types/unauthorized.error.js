class UnauthorizedError extends Error {
    status = 401
    code = 'UnauthorizedError'
    
    constructor(message = 'Unauthorized') {
        super(message)
        message = message
    }
}

module.exports = UnauthorizedError
