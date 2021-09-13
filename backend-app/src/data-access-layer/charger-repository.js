const { Client } = require('pg')

module.exports = function({ databaseInit }) {

    const exports = {}
    exports.createCharger = function(charger, callback) {

        databaseInit.Chargers.create(charger)
            .then(a => callback([], charger.chargerID))
            .catch(e => {
                if (e) {
                    console.log(e)
                    callback("Can not create charger", null)
                } else {
                    console.log(e)
                    callback(e, null)
                }
            })
    }
    return exports
}