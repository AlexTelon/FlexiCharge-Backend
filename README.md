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

# Database
- 📚 [Documentation](backend-app/docs/db/README.md)

### Connect to local database
```
  - Host: 127.0.0.1
  - Port: 5432
  - Username: postgres
  - Password: abc123
  - .env file
    - USE_LOCAL_DATABASE=1
```

### Awilix variables and methods - _consider removing_

  - **databaseInterfaceCharger**
```
    - addCharger(chargerPointId: int, function(errors, chargerId))
    - getCharger(chargerId: int, function(errors, charger))
    - removeCharger(chargerId: int, function(errors, chargerRemoved: bool))
    - updateChargerStatus(chargerId: int, status: int, function(errors, updatedCharger)) //status: 0: Occupied, 1: Available, 2: Reserved, 3: Faulty
    - getChargers(function(errors, chargers))
    - getAvailableChargers(function(errors, availableChargers))
    - getChargerBySerialNumber(serialNumber:string,function(error, charger)) //OCPP Only
```
  - **databaseInterfaceTransaction**
```
    - addTransaction(userId: int, chargerId: int, MeterStartValue: int, function(errors, transactionId))
    - getTransaction(transactionId: int, function(errors, transaction))
    - getTransactionsForUser(userId: int, function(errors, transactions))
    - getTransactionsForCharger(chargerId: int, function(errors, transactions))
    - updateTransactionPayment(transactionId: int, paymentId: int))
    - updateTransactionMeter(transactionId: int, meterValue: int))
```
  - **databaseInterfaceReservations**
```
    - addReservation(chargerId: int, userId: int, start: int, stop: int, function(errors, reservation))
    - getReservation(reservationId: int, function(errors, reservation))
    - getReservationForUser(userId: int, function(errors, reservations))
    - getReservationForCharger(chargerId: int, function(errors, reservations))
    - removeReservation(reservationId: int, function(errors, reservationRemoved: bool))
```




## OCPP
  OCPP handles communication between chargers and backend. Conversations can be iniated by either chargers or backend. A conversation is always iniated with a request and responded to with a confirmation, in most conversations the usefull data is in the request, and the confirmation is just a message to confirm that data arrived as expected. These messages try to follow the OCPP protocol as closely as possible, with some exceptions (for example uniqueID).

### Enviroment Variables
  - RUN_OCPP_TEST: Should be set to either 0 or 1. Specifies if the OCPP tests should run each time the server starts or not.
  - OCPP_TEST_INTERVAL_MULTIPLIER: Since all of the tests relies on sending OCPP messages back and fourth between the server and a charger mock, alot of the tests uses timeouts to make sure that everything runs in the correct order. But, some slower computers might needs theese timeouts to be even longer, hence this multiplier. 1 is the default time, 2 means that the timeouts are twice as long etc.
  - LIVEMETRICS_DB_UPDATE_INTERVAL: The interval between live metrics messages (MeterValues) of which the database will be updated with the latest information of a charging session. This is specified i milliseconds. 10000 means that if the server recieves a MeterValues message from the charger 10 seconds later than a previous MeterValues message for a specific transaction, the server will update the database with the new info. (MeterValues messages can of course be sent and recieved more often than this interval, only difference is that the database will not be updated)

### TESTS
  In your env. file you must set *RUN_OCCP_TEST=1* before you run *docker-compose up* to start the app.
  Now the tests will run everytime you save a file (i.e everytime the server restarts).

  Both the charger tests and live metrics tests are fully automated, meaning that before the tests run, corresponding "charger client socket mock" and "user client socket mock" are created with hardcoded responses for the server.


  - testBootNotificaiton is a request sent from the charger containing information about that charger.
  - test RemoteStart/RemoteStop/ReserveNow are conversations iniated by the server.
  - testMeterValues is a request initiated by a charger (in practice this is always prefaced with a StartTransaction request and confirmation). The request is then passed on to a user socket, and the charger also gets a MeterValues confirmation in return.

## HTTP

[HTTP documentation](./backend-app/docs/http/README.md)
