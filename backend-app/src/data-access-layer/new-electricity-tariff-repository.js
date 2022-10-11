module.exports = function ({ databaseInit }) {

    const exports = {}

    exports.addElectricityTariff = function (date, price, currency, callback) {
        databaseInit.newElectricityTarriff.create({
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
        databaseInit.newElectricityTarriff.findOne({
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
        databaseInit.newElectricityTarriff.findAll({
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

    exports.updateElectricityTariff = function (oldDate, newDate, callback) {
        databaseInit.newElectricityTarriff.update({
            date: newDate
        }, {
            where: {
                date: oldDate
            }
        }).then(electricityTariff => callback([], electricityTariff))
            .catch(error => callback(error, []))
    }

    exports.removeElectricityTariff = function (date, callback) {
        databaseInit.newElectricityTarriff.destroy({
            where: {
                date: date
            }
        }).then(callback([], true))
            .catch(error => callback(error, false))
    }

    return exports
}