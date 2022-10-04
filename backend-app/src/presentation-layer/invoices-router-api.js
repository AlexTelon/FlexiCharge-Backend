const express = require('express')
const checkJwt = require('./middleware/jwt.middleware')

module.exports = function ({databaseInterfaceInvoices}) {
    const router = express.Router()
    
    /**
     * Admin genereates an invoice. Dates should be a ISO-8601 strings; YYYY-MM-DD.
     */
    router.post('/', function (req, res) {
        const { userID, dateStart, dateEnd } = req.body
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

    /**
     * Get a list of invoices for all users.
     * Filter options: date & status 
     */
    router.get('/users', function (req, res) {
        const { status, date } = req.query

        databaseInterfaceInvoices.getAllInvoices(req.user)
    })
    
    /**
     * Get a list of invoices for a specific user.
     * Filter options: status
     */
    router.get('/users/:userID', function (req, res) {
        const { userID } = req.params
        console.log("1keopfwej");
        // databaseInterfaceInvoices.getAllInvoicesByUserID(userID, req.user, req.query)
        res.json({"he": 12})


    })
    
    /**
     * Render invoice file.
     */
    router.get('/:invoiceID', checkJwt, (req, res) => {
        const { invoiceID } = req.params

        databaseInterfaceInvoices.getInvoiceByID(invoiceID, req.user, (errors, invoiceFile) => {
            if (errors.length == 0) {
                invoiceFile.pipe(res)
            }
        })
    })

    return router
}