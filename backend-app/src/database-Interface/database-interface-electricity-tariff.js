module.exports = function ({ dataAccessLayerElectricityTariffs, dbErrorCheck }) {
    const exports = {}

    exports.getElectricityTariffsOrderByDate = function (callback) {
        dataAccessLayerElectricityTariffs.getElectricityTariffsOrderByDate(callback)
    }

    exports.generateElectricityTariffs = function (offset, callback) {
        console.debug('diet-get_0')
        const generateDays = 30
        const maxPrice = 6.0
        const minPrice = 0.5
        offsetDate = new Date()
        offsetDate.setTime(offsetDate.getTime() + offset * 60 * 60 * 1000)
        const startDate = new Date(offsetDate)
        startDate.setMinutes(0, 0, 0)
        let iterationTime = startDate.getTime()
        const promises = []

        console.debug('diet-get_1')
        for (var hour = startDate.getHours(); hour < 24 * generateDays; hour++) {
            price = (Math.random() * (maxPrice - minPrice) + minPrice).toFixed(2)
            console.debug('diet-get_2', price);
            promises.push(dataAccessLayerElectricityTariffs.addElectricityTariff({
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
        console.debug('diet-gcet_0')
        let currentDate = new Date()
        currentDate.setMinutes(0, 0, 0)
        const queryDate = new Date(currentDate).toISOString()
        dataAccessLayerElectricityTariffs.getElectricityTariffByDate(queryDate, function(error, tariff) {
            console.debug('diet-gcet_1', error, tariff)
            if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                    callback(errorCode, [])
                })
            } else {
                console.debug('diet-gcet_2')
                if (tariff != null) {
                    callback([], tariff)
                } else {
                    console.debug('diet-gcet_3')
                    //No tariffs found for this date, call the function to generate a new set.
                    exports.generateElectricityTariffs(0, function (error, result) {
                        console.debug('diet-gcet_4', error, result)
                        if (Object.keys(error).length > 0) {
                            dbErrorCheck.checkError(error, function (errorCode) {
                                callback(errorCode, [])
                            })
                        } else {
                            console.debug('diet-gcet_5')
                            let curDate = new Date()
                            curDate.setMinutes(0, 0, 0)
                            const queryDate2 = new Date(currentDate).toISOString()
                            dataAccessLayerElectricityTariffs.getElectricityTariffByDate(queryDate2, function (error, newTariff) {
                                console.debug('diet-gcet_6', error, newTariff)
                                if (Object.keys(error).length > 0) {
                                    dbErrorCheck.checkError(error, function (errorCode) {
                                        callback(errorCode, [])
                                    })
                                } else {
                                    console.debug('diet-gcet_7')
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

    return exports
}
