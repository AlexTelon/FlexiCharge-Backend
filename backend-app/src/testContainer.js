const awilix = require("awilix");

function chargePointRepositoryMock() {
    const defaultChargePoint = {
        chargePointID : 1,
        name : "Coop, Forserum",
        address : "Värnamovägen",
        coordinates : [57.70022044183724,14.475150415104222]
    }

    return {
        getChargePoint: function(id, callback) {
            const returnedChargePoint = defaultChargePoint
            returnedChargePoint.id = id
            callback([], returnedChargePoint)
        }
    }
}

const testContainer = awilix.createContainer()
testContainer.register({
    newDataAccessLayerChargePoints: awilix.asFunction(chargePointRepositoryMock),
    newDatabaseInterfaceChargePoints: awilix.asFunction(require('./database-Interface/new-database-interface-charge-points')),
    dbErrorCheck: awilix.asFunction(require('./database-Interface/error/database-error-check')),
    newChargePointValidation: awilix.asFunction(require("./database-Interface/validation/newChargePointValidation")),
})

module.exports = testContainer