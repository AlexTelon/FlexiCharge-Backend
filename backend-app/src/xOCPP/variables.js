const connectedChargers = {}
const chargerSerials = []
const chargerIDs = {}

module.exports = function ({ }) {



    exports.getChargerSerials = function () {
        return chargerSerials
    }
    exports.addChargerSerials = function (serial) {
        chargerSerials.push(serial)
    }
    exports.removeChargerSerials = function (serial) {
        var chargerSerialsIndex = chargerSerials.indexOf(serial)
        chargerSerials.splice(chargerSerialsIndex)
    }
    exports.getLengthChargerSerials = function () {
        return chargerSerials.length
    }
    exports.isInChargerSerials = function (serial) {
        return chargerSerials.includes(serial)
    }


    exports.getConnectedChargers = function () {
        return connectedChargers
    }
    exports.addConnectedChargers = function (id, socket) {
        connectedChargers[id] = socket
    }
    exports.removeConnectedChargers = function (id) {
        delete connectedChargers[id]
    }
    exports.getLengthConnectedCharges = function () {
        return Object.keys(connectedChargers).length
    }


    exports.getChargerIDs = function () {
        return chargerIDs
    }
    exports.addChargerIDs = function (serial, id) {
        chargerIDs[serial] = id
    }
    exports.removeChargerIDs = function (serial) {
        delete chargerIDs[serial]
    }
    exports.getLengthChargerIDs = function () {
        return Object.keys(chargerIDs).length
    }

    return exports
}