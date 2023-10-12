module.exports = function ({ databaseInit }) {

    const exports = {}

    exports.addElectricityTariff = function (timestamp, price, currency, callback) {
        console.debug('etr-aet_0', timestamp, price, currency)
        databaseInit.ElectricityTariffs.create({
            timestamp: timestamp,
            price: price,
            currency: currency
        }).then(electricityTariff => {
            console.debug('etr-aet_1', electricityTariff)
            callback([], electricityTariff)
        })
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.getElectricityTariffByDate = function (timestamp, callback) {
        databaseInit.ElectricityTariffs.findOne({
            where: {
                timestamp: timestamp
            }
        }).then(electricityTariff => callback([], electricityTariff))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.getElectricityTariffsOrderByDate = function (callback) {
        databaseInit.ElectricityTariffs.findAll({
            order: [['timestamp', 'DESC']],
            limit: 10
        }).then(electricityTariffs => {
            callback([], electricityTariffs)
        })
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.removeElectricityTariff = function (timestamp, callback) {
        databaseInit.ElectricityTariffs.destroy({
            where: {
                timestamp: timestamp
            }
        }).then(callback([], true))
            .catch(error => callback(error, false))
    }

    return exports
}