# FlexiCharge-Backend

# Start app
- cd /FlexiCharge-Backend
- docker-compose up

# Add packages
- cd /FlexiCharge-Backend/backend-app
- npm install "package name"

# Access database
- Add awilix variable to the module.exports function. 
```
module.exports = function({ databaseInterfaceCharger}) {

}
```
- Then you can access the methods. e.g. "getChargers". 
```
module.exports = function({ databaseInterfaceCharger}) {

   databaseInterfaceCharger.getChargers(function(errors, chargers) {
   

   })

}
```
## Awilix variables and methods
- databaseInterfaceCharger
  - addCharger(chargerId,chargerPointId,location)
  - getCharger(chargerId)
  - removeCharger(chargerId) 
  - updateChargerStatus(chargerId,status)
  - getChargers() 
  - getAvailableChargers()


## Database Interface Errorcodes and explanation
- internalError: General internal error
- databaseError: Error communicating with the database
 
