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

    exports.generateElectricityTariffs = function (offset, callback) {
        const generateDays = 30
        const maxPrice = 6.0
        const minPrice = 0.5
        offsetDate = new Date()
        offsetDate.setTime(offsetDate.getTime() + offset * 60 * 60 * 1000)
        const startDate = new Date(offsetDate)
        startDate.setMinutes(0, 0, 0)
        let iterationTime = startDate.getTime()
        const promises = []

        for (var hour = startDate.getHours(); hour < 24 * generateDays; hour++) {
            price = (Math.random() * (maxPrice - minPrice) + minPrice).toFixed(2)
            promises.push(databaseInit.newElectricityTarriff.create({
                date: new Date(iterationTime).toISOString(),
                price: price,
                currency: "SEK"
            }))
            iterationTime += 1 * 60 * 60 * 1000
        }
        Promise.all(promises).then(function (tariffs) {
            callback([], tariffs)
        }).catch(e => {
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