const SequelizeMock = require('sequelize-mock')

module.exports = function({newDatabaseInterfaceElectricityTariffs}) {
    const exports = {}

    const DBConnectionMock = new SequelizeMock();
    let ElectricityTariffs = DBConnectionMock.define('newElectricityTariffs', {
        date: null,
        price: null,
        currency: null
    })

    exports.runTests = function(){
        const FailedTests = []
        

        if (FailedTests.length == 0) {
            console.log(`All Electricity Tariff Tests succeeded!`);
        } else {
            console.log(`Electricity Tariff had ${FailedTests.length} failed tests!`);
            FailedTests.forEach(message => {
                console.log(message);
            });
        }
    }

    return exports
}