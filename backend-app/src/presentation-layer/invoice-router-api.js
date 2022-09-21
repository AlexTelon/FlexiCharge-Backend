var express = require('express')
const fs = require('fs')
const path = require('path')

module.exports = function ({}) {
    const router = express.Router()
    
    /**
     * Admin genereates an invoice. Dates should be a ISO-8601 strings; YYYY-MM-DD.
     */
    router.post('/', function (req, res) {
        const { userID, dateStart, dateEnd, adminSession } = req.body
        // 1. Validation (input format)
        // 2. Auth check (admin check)
        // 3. Generate PDF.
        // 4. Insert data to Database.
        // 5. Send confirmation response.
        
        res.status(201).json({
            statusCode: 201,
            message: 'Resource was created',
            resourceID: 'dummy'
        })
    })
    

    router.get('/user/:userID', function (req, res) {
        const { userID } = req.params
        const { adminSession, userSession} = req.body
    })

    router.get('/:invoiceID', function (req, res) {
        const { invoiceID } = req.params
        const { adminSession, userSession} = req.body
        
        fs.createReadStream(path.join(__dirname, '/invoice-example.pdf')).pipe(res)


    })

    return router
}
