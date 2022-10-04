class BadRequestError extends Error {
    status = 400
    
    constructor(errorCodes = [], message = 'Bad Request') {
        super(message)
        message = message
        this.errorCodes = errorCodes
    }
}

module.exports = BadRequestError
