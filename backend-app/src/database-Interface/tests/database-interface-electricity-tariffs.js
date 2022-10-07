const SequelizeMock = require('sequelize-mock')

module.exports = function({newDatabaseInterfaceElectricityTariffs}) {
    const exports = {}

    const dateToday = new Date(new Date())
    const DBConnectionMock = new SequelizeMock();
    let ElectricityTariffs = DBConnectionMock.define('newElectricityTariffs', {
        date: dateToday.toISOString(),
        price: 3.51,
        currency: "SEK"
    })

    exports.getElectricityTariffsOrderByDateTest = function(callback) {      
        ElectricityTariffs.$queueResult(
            [
            ElectricityTariffs.build({price: 1.337}), 
            ElectricityTariffs.build({price: 8.765}), 
            ElectricityTariffs.build({price: 4.123})
            ]
        )


        newDatabaseInterfaceElectricityTariffs.getElectricityTariffsOrderByDate(ElectricityTariffs, (error, electricityTariffs) => {
            const errorList = []

            error.forEach(err => {
                errorList.push(err)
            });

            if (electricityTariffs.length !== 3) {
                errorList.push(`Returned : ${electricityTariffs.length} instead of 3, which was the expected outcome.`)
            }

            callback(errorList)
        })
    }

    // Tests if getCurrentElectricityTariff
    exports.getCurrentElectricityTariffTest = function(callback) {      
        newDatabaseInterfaceElectricityTariffs.getCurrentElectricityTariff(ElectricityTariffs, (error, electricityTariff) => {
            const errorList = []

            error.forEach(err => {
                errorList.push(err)
            });

            let currentDateWithNoMinutes = new Date()
            currentDateWithNoMinutes.setMinutes(0,0,0)
            currentDateWithNoMinutes = currentDateWithNoMinutes.toISOString()

            // Check if electricityTariff time matches hour.now without minutes!
            if (electricityTariff.dataValues.date !== currentDateWithNoMinutes) {
                errorList.push("No new electric tariff was created")
            }

            callback(errorList)
        })
    }

    exports.getCurrentElectricityTariffTest = function(callback) {      
        newDatabaseInterfaceElectricityTariffs.getCurrentElectricityTariff(ElectricityTariffs, (error, electricityTariff) => {
            const errorList = []

            error.forEach(err => {
                errorList.push(err)
            });

            let currentDateWithNoMinutes = new Date()
            currentDateWithNoMinutes.setMinutes(0,0,0)
            currentDateWithNoMinutes = currentDateWithNoMinutes.toISOString()

            // Check if electricityTariff time matches hour.now without minutes!
            if (electricityTariff.dataValues.date !== currentDateWithNoMinutes) {
                errorList.push("No new electric tariff was created")
            }

            callback(errorList)
        })
    }

    exports.updateElectricityTariffTest = function(oldDate, newDate, callback) {
        newDatabaseInterfaceElectricityTariffs.updateElectricityTariff(oldDate, newDate, ElectricityTariffs, (error, electricityTariff) => {
            const errorList = []

            error.forEach(err => {
                errorList.push(err)
            });

            callback(errorList)
        })   
    }

    exports.runTests = function(){
        const FailedTests = []
        let amountOfTestsDone = 0
        let totalTests = Object.keys(exports).length - 1

        const checkIfAllTestsAreDone = function() {
            amountOfTestsDone++

            if (amountOfTestsDone >= totalTests) {
                if (FailedTests.length == 0) {
                    console.log(`All Electricity Tariff Tests succeeded!`);
                } else {
                    console.log(`Electricity Tariff had ${FailedTests.length} failed tests!`);
                    FailedTests.forEach(message => {
                        console.log(message);
                    });
                }
            }
        }

        exports.getElectricityTariffsOrderByDateTest((errors) => {
            errors.forEach(err => {
                FailedTests.push(`getElectricityTariffsOrderByDateTest Failed! - ${err}`)
            })

            checkIfAllTestsAreDone()
        })
        
        exports.getCurrentElectricityTariffTest((errors) => {
            errors.forEach(err => {
                FailedTests.push(`getCurrentElectricityTariffTest Failed! - ${err}`)
            })

            checkIfAllTestsAreDone()
        })

        

        var dateTomorrow = new Date();
        dateTomorrow.setDate(dateTomorrow.getDate()+1);

        exports.updateElectricityTariffTest(dateToday, dateTomorrow, (errors) => {
            errors.forEach(err => {
                FailedTests.push(`updateElectricityTariffTest Failed! - ${err}`)
            })

            checkIfAllTestsAreDone()
        })

        
    }

    return exports
}