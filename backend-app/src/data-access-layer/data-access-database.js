const { Client } = require('pg')

module.exports = function() {

    const exports = {}
    exports.connect = function(callback) {
        const client = new Client({
            host: "flexicharge.cqjgliexpw2a.eu-west-1.rds.amazonaws.com",
            port: 5432,
            user: "postgres",
            password: "postgres"
        });

        client.connect((err) => {
            if (err) {
                callback('connection error', err.stack)
            } else {
                callback([], 'connected')
            }
        })


    }
    return exports
}