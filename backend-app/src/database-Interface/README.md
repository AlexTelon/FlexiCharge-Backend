
# Interfaces

  

## Functions - Overview

### database-interface-charge-points.js

- getChargePoint
	- Purpose : Get ChargePoint by the chargePointID.
- getChargePoints
	- Purpose : Get all ChargePoints in the database.
- addChargePoint
	- Purpose : Adds a new ChargePoint.
- removeChargePoint
	- Purpose : Removes a ChargePoint by the chargePointID.
- updateChargePoint
	- Purpose : Updates a ChargePoint.

### database-interface-charge-sessions.js

- getChargeSession
	- Purpose : Get a ChargeSession by the chargeSessionID.
- getChargeSessions
	- Purpose : Gets all ChargeSessions that belong to a specific connectorID.
- updateChargingState
	- Purpose : Updates the properties currentChargePercentage and kWhTransferred.
- startChargeSession (When a user wants to start charging his car)
	- Purpose : Starts a ChargeSession.
	- Extra Information : 
		1. Creates a new transaction object and link it with our new ChargeSessionID. (This transaction will later be updated with the totalPrice, which depends on how many kilowatts the user used during his ChargingSession).
		2. Contacts OCPP and use remoteStartTransaction(), which will start recording how many kilowatts the user is consuming. 
- endChargeSession (When a user is finished charging his car)
	- Purpose : Ends a ChargingSession.
	- Extra Information :
		1. Contacts OCPP and use remoteStopTransaction(), which returns the kWhTransferred during the full ChargeSession. 
		2. totalPrice = (kWhTransferred * pricePerKwh).
			- Currently pricePerKwh is retrieved by the electricityTariffs table, however it should be retrieved by "Live Metrics" done by the OCPP team.
		3. The Transaction connected to this ChargeSession is finally updated with the totalPrice.

### database-interface-chargers.js
   - getChargers 
       - Purpose : Gets all Chargers in the database
   - getCharger 
       - Purpose : Gets a Charger by connectorID
   - getChargerBySerialNumber
       - Purpose : Get Charger by serialNumber
   - getAvailableChargers
       - Purpose : Gets all Chargers with status = "Available"
   - addCharger
       - Purpose : Adds a Charger
         - At the moment all charges are marked as "Available" on creation
   - removeCharger
       - Purpose : Removes a Charger by connectorID
   - updateChargerStatus
       - Purpose : Update status of a Charger
   - getChargerForTransaction
       - Purpose : Gets a Charger by transactionID
### database-interface-electricity-tariff.js
- getElectricityTariffsOrderByDate
	- Purpose : Gets all ElectricityTariffs, ordered by date.
- generateElectricityTariffs
	- Purpose : Generates random price for each hour of a month.
- getCurrentElectricityTariff
	- Purpose : Looks for ElectricityTariff price, if no price has been generated for the current time, then we run generateElectricityTariff().
  ### database-interface-klarna-payments.js
  - getNewKlarnaPaymentSession
	  - Purpose : Creates a new Klarna payment session by contacting the Klarna API. Both the returned session_id and client_token will be saved to the database by calling addKlarnaPayment().
  - createKlarnaOrder
	  - Purpose : Creates a new Klarna order with authorization_token and totalPrice, if order is created succesfully, then we update orderID.
	  - Extra Information : authorization_token can only be accessed via the Klarna Widget (Postman requests can not get authorization_token back in responses, ONLY the Klarna widget). 
	  - More information regarding **how to get authorization token** can be found here(Step 1 -> 3 under "Integrate with Klarna Payment" are important): https://docs.klarna.com/klarna-payments/integrate-with-klarna-payments/
  - finalizeKlarnaOrder
	  - Purpose : Finalize the Klarna order and update isPaid to **true**.
### database-interface-transaction.js
- addTransaction
	- Purpose : Adds a new Transaction.
- getTransaction
	- Purpose : Get Transaction by transactionID.
- getTransactionsForUser
	- Purpose : Gets all Transactions for a user.
- updatePaymentMethod
	- Purpose : Update paymentMethod property.
- updatepaidDate
	- Purpose : Update paidDate property.
- updateTotalPrice
	- Purpose : Update totalPrice property.
- getTransactionForChargeSession
	- Purpose : Find Transaction with chargeSessionID.
	- 
### Extra

- Known Bugs

	- Nothing at the moment

- Important Information:

	- Be aware of the implementation of the "Timestamp" in "ElectricityTariffs"

		- It differs from the dateType used by the other Teams.

		- Take into consideration the UTC.
	- authorization_token can only be accessed via the Klarna Widget (Postman requests can not get authorization_token back in responses, ONLY the Klarna widget). 
		- authorization_token is a **completely** different token from session_id and client_token, and should only live inside the client side (should not be stored on the backend). 
		- More information regarding **how to get authorization token** can be found here(Step 1 -> 3 under “Integrate with Klarna Payment” are important): [https://docs.klarna.com/klarna-payments/integrate-with-klarna-payments/](https://docs.klarna.com/klarna-payments/integrate-with-klarna-payments/)

- .....

## What is done and what is not done

  - To implement
  - 

  

###[🔙Main Database Documentation](../../../README.md)

###[🔙🔙Back To Main Documentation](../../../README.md)