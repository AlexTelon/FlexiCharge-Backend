module.exports = function({}){
    const exports = {}

    //Validation for session_id
    MIN_SESSION_ID = 1

    //Validation for client_token
    MIN_CLIENT_TOKEN = 1

    exports.addKlarnaPaymentValidation = function(session_id, client_token) {

        const validationErrors = []

        if (session_id === undefined || session_id === null) {
            validationErrors.push("klarnaError")
        } else {
            if (typeof session_id !== 'string') {
                validationErrors.push("klarnaError")
            }
            if (session_id.length < MIN_SESSION_ID) {
                validationErrors.push("klarnaError")
            }
        }

        if (client_token === undefined || client_token === null) {
            validationErrors.push("klarnaError")
        } else {
            if (typeof client_token !== 'string') {
                validationErrors.push("klarnaError")
            }
            if (client_token.length < MIN_CLIENT_TOKEN) {
                validationErrors.push("klarnaError")
            }
        }

        return validationErrors
    }

    return exports
}
