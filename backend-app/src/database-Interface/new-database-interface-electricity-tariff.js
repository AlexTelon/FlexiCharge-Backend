module.exports = function({newDataAccessLayerElectricityTariffs, dbErrorCheck}) {
    const exports = {}

    exports.getElectricityTariffsOrderByDate = function(database, callback){
        newDataAccessLayerElectricityTariffs.getElectricityTariffsOrderByDate(database, callback)
    }

    exports.getCurrentElectricityTariff = function(database, callback){
        let currentDate = new Date()
        currentDate.setMinutes(0, 0, 0)
        const queryDate = new Date(currentDate).toISOString()
        newDataAccessLayerElectricityTariffs.getElectricityTariffByDate(queryDate, database, function(error, tariff){
            if(Object.keys(error).length > 0){
                dbErrorCheck.checkError(error, function(errorCode){
                    callback(errorCode, [])
                })
            } else {
                if(tariff != null){
                    callback([], tariff)
                } else {
                    //No tariffs found for this date, call the function to generate a new set.
                    newDataAccessLayerElectricityTariffs.generateElectricityTariffs(0, database, function(error, result){
                        if(Object.keys(error).length > 0){
                            dbErrorCheck.checkError(error, function(errorCode) {
                                callback(errorCode, [])
                            })
                        } else {
                            let curDate = new Date()
                            curDate.setMinutes(0, 0, 0)
                            const queryDate2 = new Date(currentDate).toISOString()
                            newDataAccessLayerElectricityTariffs.getElectricityTariffByDate(queryDate2, database, function(error, newTariff) {
                                if(Object.keys(error).length > 0){
                                    dbErrorCheck.checkError(error, function(errorCode){
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

    exports.updateElectricityTariff = function(oldDate, newDate, database, callback){
        // TODO add validation for Dates!

        newDataAccessLayerElectricityTariffs.updateElectricityTariff(oldDate, newDate, database, function(error, electricityTariff) {
            if(Object.keys(error).length > 0){
                dbErrorCheck.checkError(error, function(errorCode){
                    callback(errorCode, [])
                })
            } else {
                callback([], electricityTariff)
            }
        })
    }

    return exports
}