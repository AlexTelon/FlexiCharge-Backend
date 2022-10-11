module.exports = function ({ newDataAccessLayerElectricityTariffs, dbErrorCheck }) {
    const exports = {}

    exports.getElectricityTariffsOrderByDate = function (callback) {
        newDataAccessLayerElectricityTariffs.getElectricityTariffsOrderByDate(callback)
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
            promises.push(newDataAccessLayerElectricityTariffs.addElectricityTariff({
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

    exports.getCurrentElectricityTariff = function (callback) {
        let currentDate = new Date()
        currentDate.setMinutes(0, 0, 0)
        const queryDate = new Date(currentDate).toISOString()
        newDataAccessLayerElectricityTariffs.getElectricityTariffByDate(queryDate, function(error, tariff) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [])
                })
            } else {
                if (tariff != null) {
                    callback([], tariff)
                } else {
                    //No tariffs found for this date, call the function to generate a new set.
                    exports.generateElectricityTariffs(0, function (error, result) {
                        if (Object.keys(error).length > 0) {
                            dbErrorCheck.checkError(error, function (errorCode) {
                                callback(errorCode, [])
                            })
                        } else {
                            let curDate = new Date()
                            curDate.setMinutes(0, 0, 0)
                            const queryDate2 = new Date(currentDate).toISOString()
                            newDataAccessLayerElectricityTariffs.getElectricityTariffByDate(queryDate2, function (error, newTariff) {
                                if (Object.keys(error).length > 0) {
                                    dbErrorCheck.checkError(error, function (errorCode) {
                                        callback(errorCode, [])
                                    })
                                } else {
                                    //Created new tariffs and fetched the new one for current time.
                                    callback([], newTariff)
                                }
                            })
                        }
                    })
                }

            }
        })
    }

    

    exports.updateElectricityTariff = function (oldDate, newDate, callback) {
        // TODO add validation for Dates!

        newDataAccessLayerElectricityTariffs.updateElectricityTariff(oldDate, newDate, function (error, electricityTariff) {
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [])
                })
            } else {
                callback([], electricityTariff)
            }
        })
    }

    return exports
}