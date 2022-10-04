class NotFoundError extends Error {
    status = 404
    code = 'NotFoundError'
    
    constructor(message = 'Resource not found.') {
        super(message)
        message = message
    }
}

module.exports = NotFoundError

