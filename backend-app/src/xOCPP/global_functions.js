module.exports = function ({ }) {
    
    exports.buildJSONMessage = function (messageArray) {
        const message = []
        messageArray.forEach(i => {
            message.push(i)
        })
        
        return JSON.stringify(message)
    }

    exports.getUniqueId = function (chargerID, action) {
        
        return chargerID.toString() + action.toString() + Date.now().toString()
    }
    return exports
}