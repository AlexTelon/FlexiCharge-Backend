const SequelizeMock = require("sequelize-mock");
const { interfaceHandler } = require("../../xOCPP/interface_handler");

module.exports = function({ databaseInterfaceChargePoint, transactionValidation }) {

    const exports = {}

    let DBConnectionMock = new SequelizeMock();
    
    var ChargePointMock = DBConnectionMock.define('ChargePoint', {
        "chargePointID": 1,
        "name": "Airport Parking, Jönköping",
        "location": [50.10, 50.10],
        "price": 100,
        "klarnaReservationAmount": 100
    })

    ChargePointMock.$queryInterface.$useHandler(function(query, queryOptions, done) {
        if(query === 'findOne') {
            if(queryOptions[0].where.id === 1) {
                return ChargePointMock.build({chargePointID: 1, name: "Airport Parking, Jönköping", location: [50.10, 50.10], price: 100, klarnaReservationAmount: 100})
            } else {
                return null;
            }
        }
    })

    exports.getChargePointTest = function(chargePointID, callback){
        databaseInterfaceChargePoint.getChargePoint(chargePointID, ChargePointMock, function(error, chargePoint) {
            console.log("GetChargePointTest completed.");
            callback(error, chargePoint)
        })
    }

    exports.runTests = function() {
        const FailedTests = []

        exports.getChargePointTest(1, (error, chargePoint) => {
            if(error.length > 0){
                FailedTests.push(`getChargePointTest Failed! : ${error}`)
            }
        })

        if (FailedTests.length == 0) {
            console.log(`All ChargePoint Tests succeeded!`);
        } else {
            console.log(`ChargePoint tests had ${FailedTests.length} failed tests!`);
            FailedTests.forEach(message => {
                console.log(message);
            });
        }
    }

    return exports
}
