/** This file should be removed before production,
 *  Only used for testing the database connection.
 */
const express = require('express')

module.exports = function({ businessLogicDatabase }) {

    const router = express.Router()

    router.use('/', function(request, response, next) {
        next()
    })

    router.get("/check", function(request, response) {
        businessLogicDatabase.connect(function(errors, success) {
            console.log(errors)
            console.log(success)
            response.redirect("/")
        })
    })

    return router
}