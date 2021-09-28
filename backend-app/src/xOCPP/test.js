module.exports = function ({ ocppInterface }) {


    exports.test = function () {
        console.log("Got test :)")
        ocppInterface.reserveNow(111111, 1, Date.now(), 123, 321, null, function (error, response) {

            console.log("Test result response:" + response)
            console.log("Test result error:" + error)
        })
    }

    return exports
}