const express = require('express')

module.exports = function () {
    const router = express.Router()
    
    router.get('/current', (req, res) => {
        /**
         * Fetch current kwh price from electricity table 
         * between 2 timestamps. Waiting for the Database.
         * 
         * possible response codes: 200 & 500
         */
        
        res.status(200).json({
            dateFrom: 1,
            dateTo: 2,
            price: 4.65,
            currency: 'SEK'
        })
    })

    return router
}
