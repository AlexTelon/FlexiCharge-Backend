module.exports = function({newDataAccessLayerElectricityTariffs, dbErrorCheck}) {
    const exports = {}

    exports.getElectricityTariffsOrderByDate = function(callback){
        newDataAccessLayerElectricityTariff.getElectricityTariffsOrderByDate(callback)
    }

    exports.getCurrentElectricityTariff = function(database, callback){
        let currentDate = new Date()
        currentDate.setMinutes(0, 0, 0)
        const queryDate = new Date(currentDate).toISOString()
        newDataAccessLayerElectricityTariff.getElectricityTariffByDate(queryDate, database, function(error, tariff){
            if(Object.keys(error).length > 0){
                dbErrorCheck.checkError(error, function(errorCode){
                    callback(errorCode, [])
                })
            } else {
                if(tariff != null){
                    callback([], tariff)
                } else {
                    //No tariffs found for this date, call the function to generate a new set.
                    newDataAccessLayerElectricityTariff.generateElectricityTariffs(0, database, function(error, result){
                        if(Object.keys(error).length > 0){
                            dbErrorCheck.checkError(error, function(errorCode) {
                                callback(errorCode, [])
                            })
                        } else {
                            let curDate = new Date()
                            curDate.setMinutes(0, 0, 0)
                            const queryDate2 = new Date(currentDate).toISOString()
                            newDataAccessLayerElectricityTariff.getElectricityTariffByDate(queryDate2, database, function(error, newTariff) {
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

    exports.updateElectricityTariff = function(oldDate, newDate, callback){
        newDataAccessLayerElectricityTariff.updateElectricityTariff(oldDate, newDate, function(error, electricityTariff) {
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