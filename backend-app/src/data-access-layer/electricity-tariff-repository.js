module.exports = function ({ databaseInit }) {

    const exports = {}

    exports.addElectricityTariff = function (date, price, currency, callback) {
        databaseInit.ElectricityTariffs.create({
            date: date,
            price: price,
            currency: currency
        }).then(electricityTariff => callback([], electricityTariff))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.getElectricityTariffByDate = function (date, callback) {
        databaseInit.ElectricityTariffs.findOne({
            where: {
                date: date
            }
        }).then(electricityTariff => callback([], electricityTariff))
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.getElectricityTariffsOrderByDate = function (callback) {
        databaseInit.ElectricityTariffs.findAll({
            order: [['date', 'DESC']],
            limit: 10
        }).then(electricityTariffs => {
            callback([], electricityTariffs)
        })
            .catch(e => {
                console.log(e)
                callback(e, [])
            })
    }

    exports.removeElectricityTariff = function (date, callback) {
        databaseInit.ElectricityTariffs.destroy({
            where: {
                date: date
            }
        }).then(callback([], true))
            .catch(error => callback(error, false))
    }

    return exports
}