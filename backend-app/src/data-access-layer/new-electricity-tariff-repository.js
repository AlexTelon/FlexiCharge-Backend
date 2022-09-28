module.exports = function({databaseInit}) {

    const exports = {}

    exports.addElectricityTariff = function(date, price, currency, database, callback){
        if(database == null){
            database = databaseInit.newElectricityTariffs
        } 

        database.create({
            date: date,
            price: price,
            currency: currency
        }).then(electricityTariff => callback([], electricityTariff))
        .catch(e => {
            console.log(e)
            callback(e, [])
        })
    }

    exports.getElectricityTariffByDate = function(date, database, callback) {
        if(database == null){
            database = databaseInit.newElectricityTariffs
        } 

        database.findOne({
            where: {
                date: date
            }
        }).then(electricityTariff => callback([], electricityTariff))
        .catch(e => {
            console.log(e)
            callback(e, [])
        })
    }

    exports.getElectricityTariffsOrderByDate = function(database, callback){
        if(database == null){
            database = databaseInit.newElectricityTariffs
        } 

        database.findAll({
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

    exports.generateElectricityTariffs = function(offset, database, callback){
        if(database == null){
            database = databaseInit.newElectricityTariffs
        }

        const generateDays = 30
        const maxPrice = 6.0
        const minPrice = 0.5
        offsetDate = new Date()
        offsetDate.setTime(offsetDate.getTime() + offset*60*60*1000)
        const startDate = new Date(offsetDate)
        startDate.setMinutes(0, 0, 0)
        let iterationTime = startDate.getTime()
        const promises = []

        for(var hour = startDate.getHours(); hour < 24 * generateDays; hour++){
            price = (Math.random() * (maxPrice - minPrice) + minPrice).toFixed(2)
            promises.push(database.create({
                date: new Date(iterationTime).toISOString(),
                price: price,
                currency: "SEK"
            }))
            iterationTime += 1*60*60*1000
        }
        Promise.all(promises).then(function(tariffs) {
            callback([], tariffs)
        }).catch(e => {
            console.log(e)
            callback(e, [])
        })
    }

    exports.updateElectricityTariff = function(oldDate, newDate, database, callback){
        if(database == null){
            database = databaseInit.newElectricityTariffs
        }

        database.update({
            date: newDate
        },{
            where: {
                date: oldDate
            }
        }).then(electricityTariff => callback([], electricityTariff))
        .catch(error => callback(error, []))
    }

    exports.removeElectricityTariff = function(date, database, callback){
        if(database == null){
            database = databaseInit.newElectricityTariffs
        }

        database.destroy({
            where: {
                date: date
            }
        }).then(callback([], []))
        .catch(error => callback(error, []))
    }

    return exports
}