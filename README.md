# FlexiCharge-Backend

# Start up
## Prerequisites
Needed to start app.
### .env.example file
- Create a .env with variables matching the .env.example file.
- Populate these variables in the .env file.
- It's validated that these variables are populated.
## Start app
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
# Connect to local database
  - Host: 127.0.0.1
  - Port: 5432
  - Username: postgres
  - Password: abc123
## Awilix variables and methods
- databaseInterfaceCharger
  - addCharger(chargerPointId: int, function(errors, chargerId))
  - getCharger(chargerId: int, function(errors, charger))
  - removeCharger(chargerId: int, function(errors, chargerRemoved: bool)) 
  - updateChargerStatus(chargerId: int, status: int, function(errors, updatedCharger)) //status: 0: Occupied, 1: Available, 2: Reserved, 3: Faulty
  - getChargers(function(errors, chargers)) 
  - getAvailableChargers(function(errors, availableChargers))
  - getChargerBySerialNumber(serialNumber:string,function(error, charger)) //OCPP Only
- databaseInterfaceTransaction
  - addTransaction(userId: int, chargerId: int, MeterStartValue: int, function(errors, transactionId))
  - getTransaction(transactionId: int, function(errors, transaction))
  - getTransactionsForUser(userId: int, function(errors, transactions))
  - getTransactionsForCharger(chargerId: int, function(errors, transactions))
  - updateTransactionPayment(transactionId: int, paymentId: int))
  - updateTransactionMeter(transactionId: int, meterValue: int))
- databaseInterfaceReservations
  - addReservation(chargerId: int, userId: int, start: int, stop: int, function(errors, reservation))
  - getReservation(reservationId: int, function(errors, reservation))
  - getReservationForUser(userId: int, function(errors, reservations))
  - getReservationForCharger(chargerId: int, function(errors, reservations))
  - removeReservation(reservationId: int, function(errors, reservationRemoved: bool))


## Database Interface Errorcodes and explanation
- internalError: General internal error
- dbError: General database error
- dbForeignKeyConstraintError: Specified foreign key doesn´t match a primary key
- dbUniqueConstraintError: A unique constraint has been violated


## OCPP 
  OCPP handles communication between chargers and backend. Conversations can be iniated by either chargers or backend. A conversation is always iniated with a request and responded to with a confirmation, in most conversations the usefull data is in the request, and the confirmation is just a message to confirm that data arrived as expected.  

### TESTS
  In your env. file you must set *RUN_OCCP_TEST=1* before you run *docker-compose up* to start the app. 
  Now the tests will run everytime you save a file.

  testBootNotificaiton is a request sent from the charger containing information about that charger.
  test RemoteStart/RemoteStop/ReserveNow are conversations iniated by the server.

## HTTP

[HTTP documentation](./backend-app/docs/http/README.md)
