module.exports = function ({ ocppInterface, databaseInterfaceCharger, constants}) {
    const c = constants.get()

    exports.testSSB = function () {

        console.log("Got test SSB :)")
        ocppInterface.reserveNow(100004, 1, 123, 321, null, function (error, response) {

            console.log("Test result response:" + response)
            console.log("Test result error:" + error)
        })
    }

    exports.testChargerPlus = function () {

        console.log("Got test ChargerPlus :)")
        ocppInterface.reserveNow(100005, 1, 123, 321, null, function (error, response) {

            console.log("Test result response:" + response)
            console.log("Test result error:" + error)
        })
    }

    

    //test 1
    exports.testFreeCharger = function (chargerID) {

        console.log("Got test FreeCharger :)")

        databaseInterfaceCharger.updateChargerStatus(chargerID, c.AVAILABLE, function (error, charger) {
            if (error.length > 0) {
                console.log("Error updating charger status in DB: " + error)
            } else {
                console.log("Charger "+chargerID+ " updated in DB: " + charger.status)
               
            
            }
        })
    }

    //test 2
    exports.testRemoteStart = function (chargerID) {

        console.log("Got test RemoteStart :)")
        ocppInterface.remoteStartTransaction(chargerID, c.CONNECTOR_ID, c.ID_TAG, function (error, response) {

            console.log("Test result response:" + response)
            console.log("Test result error:" + error)
        })
    }

    //test 3
    exports.testRemoteStop = function (chargerID) {

        console.log("Got test RemoteStop :)")
        ocppInterface.remoteStopTransaction(chargerID, c.TRANSACTION_ID, function (error, response) {

            console.log("Test result response:" + response)
            console.log("Test result error:" + error)
        })
    }

    // test 4
    exports.testReserveNow = function (chargerID) {

        console.log("Got test ChargerPlus :)")
        ocppInterface.reserveNow(chargerID, c.CONNECTOR_ID, c.ID_TAG, c.RESERVATION_ID, c.PARENT_ID_TAG, function (error, response) {

            console.log("Test result response:" + response)
            console.log("Test result error:" + error)
        })
    }

    return exports
}
