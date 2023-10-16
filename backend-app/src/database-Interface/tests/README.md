
# Type of Tests - Unit Testing

## Overview

 - Unit tests done on the interface(business-logic-layer) are done with **Jest**!
  - In order to run these tests you need to:
	 1. Open the project via Ubuntu(VSCode WSL Window), this gives you access to the necessary node_modules used in the testing files (specifically awilix and Jest). How to open the VSCode WSL Window should have been shown during  the "Web Development - Advanced Concepts" course by Peter.
	 2. Run the command: **"npm run test"**
 - All repositories are manually mocked as seen in testContainer.js, these mocks are then injected into the testContainer, which allows us to directly test the business-logic-layer.
	 - If any repositories or database tables change, you **should** update the mocked repositories. However, in the event that the mocked repositories are *not* updated, the tests should alert you about this.


## What is done and what is not done
### The tests that are currently implemented cover the following interfaces:

#### databaseInterfaceElectricityTariffs:
 tests for the getElectricityTariffsOrderByDate, and getCurrentElectricityTariff functions.


#### databaseInterfaceTransactions: 
tests for the addTransaction, getTransaction, getTransactionsForUser, updatePaymentMethod, updatepaidDate, updateTotalPrice, getTransactionsForCharger and getTransactionForChargeSession functions.

#### invoicesValidation: 
tests for the getInvoiceIDValidation, getUserIDValidation, getInvoiceStatusFilterValidation, getInvoiceDateFilterValidation, and 
getInvoiceDateValidation functions.

#### transactionsValidation: 
tests for the getAddTransactionValidation, getUpdateTransactionChargingStatus, and addKlarnaTransactionValidation functions.

#### databaseInterfaceKlarnaPayemnts:
tests for the getNewKlarnaPaymentSession, createKlarnaOrder and finalizeKlarnaOrder functions.

#### chargePointValidation:
tests for the chargePointValidation function.

#### chargerValidation:
tests for the getChargerBySerialNumberValidation, getAddChargerValidation and getUpdateChargerStatusValidation functions.

#### databaseInterfaceChargePoints:
tests for the getChargePoint, getChargePoints, addChargePoint, removeChargePoint and updateChargePoint functions.

#### databaseInterfaceChargeSessions:
tests for the startChargeSession, getChargeSession, getChargeSessions, updateChargingState, endChargeSession, calculateTotalChargePrice and updateMeterStart functions.

#### databaseInterfaceChargersTest:
tests for the getChargers, getCharger, getChargerBySerialNumber, getAvailableChargers, addCharger, removeCharger and updateChargerStatus functions.


**The tests ensure that the functions are working as expected and handle various edge cases such as invalid inputs, empty strings, and non-string values.**

### Tests for the following interfaces are not yet implemented:

 #### 1. live-metrics? 
 (a live-metric interface may be needed for the future)

### [🔙Main Database Documentation](../../../docs/db/README.md)

### [🔙🔙Back To Main Documentation](../../../../README.md)
