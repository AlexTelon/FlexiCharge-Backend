module.exports = function ({ ocppInterface, databaseInterfaceCharger }) {


    exports.test = function () {

        console.log("Got test :)")
        ocppInterface.reserveNow(100000, 1, 123, 321, null, function (error, response) {

            console.log("Test result response:" + response)
            console.log("Test result error:" + error)
        })
    }

    return exports
}