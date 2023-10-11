module.exports = function ({ dataAccessLayerTransactions, transactionValidation, dbErrorCheck, ocppInterface }) {

    const exports = {}

    exports.addTransaction = function (chargeSessionID, userID, connectorID, payNow, paymentDueDate, paymentMethod, totalPrice, callback) {
        const validationErrors = transactionValidation.getAddTransactionValidation(chargeSessionID, userID, payNow)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
            return
        }
        else {
            timestamp = (Date.now() / 1000 | 0)
            connectorID = connectorID
            idTag = 0;
            parentIdTag = 0; // Optional according to OCPP

            ocppInterface.reserveNow(connectorID, idTag, parentIdTag, function (error, returnObject) {
                console.log("Entering ocppInterface reserveNow")
                if (error != null || returnObject.status == "Rejected") {
                    callback(["couldNotReserveCharger"], [])
                } else {
                  console.log("Before adding transaction 2")
                    dataAccessLayerTransactions.addTransaction(chargeSessionID, userID, payNow, paymentDueDate, paymentMethod, totalPrice, function (error, transaction) {
                        if (Object.keys(error).length > 0) {
                            dbErrorCheck.checkError(error, function (errorCode) {
                                callback(errorCode, [])
                            })
                            return
                        }
                        callback([], transaction)
                    })
                }
            })
        }

    }

  exports.startTransaction = function (transactionID, callback) {
    // const validationErrors = transactionValidation.getTransactionValidation(transactionID);
    // if (validationErrors.length > 0) {
    //   callback(validationErrors, []);
    //   return;
    // }

    dataAccessLayerTransactions.getTransaction(transactionID, function (error, transaction) {
      if (Object.keys(error).length > 0) {
        dbErrorCheck.checkError(error, function (errorCode) {
          callback(errorCode, []);
        });
        return;
      }
      if (transaction == null) {
        callback([], []);
        return;
      }

      console.log(1, transaction)

      ocppInterface.remoteStartTransaction(transaction['ChargeSession.connectorID'], transaction.transactionID, function (error, returnObject) {
        if (error != null || returnObject.status == "Rejected") {
            console.error('Error:', error, returnObject);
            callback(["couldNotStartTransaction"], []);
            return;
        }

        callback([], transaction);
      });
    });
  };

  exports.getTransaction = function (transactionID, callback) {
    const validationErrors = transactionValidation.getTransactionValidation(transactionID);
    if (validationErrors.length > 0) {
      callback(validationErrors, []);
      return;
    }
    dataAccessLayerTransactions.getTransaction(transactionID, function (error, transaction) {
      if (Object.keys(error).length > 0) {
        dbErrorCheck.checkError(error, function (errorCode) {
          callback(errorCode, []);
        });
        return;
      }
      if (transaction == null) {
        callback([], []);
        return;
      }
      callback([], transaction);
    });
  };

  exports.getTransactionsForUser = function (userID, callback) {
    const validationErrors = transactionValidation.getTransactionsForUserValidation(userID);
    if (validationErrors.length > 0) {
      callback(validationErrors, []);
      return;
    }
    dataAccessLayerTransactions.getTransactionsForUser(userID, function (error, userTransaction) {
      if (Object.keys(error).length > 0) {
        dbErrorCheck.checkError(error, function (errorCode) {
          callback(errorCode, []);
        });
        return;
      }
      callback([], userTransaction);
    });
  };

  exports.updatePaymentMethod = function (transactionID, paymentMethod, callback) {
    const validationErrors = transactionValidation.getUpdatePaymentMethodValidation(transactionID, paymentMethod);
    if (validationErrors.length > 0) {
      callback(validationErrors, []);
      return;
    }
    dataAccessLayerTransactions.updatePaymentMethod(transactionID, paymentMethod, function (error, transaction) {
      if (Object.keys(error).length > 0) {
        dbErrorCheck.checkError(error, function (errorCode) {
          callback(errorCode, []);
        });
        return;
      }
      callback([], transaction);
    });
  };

  exports.updatepaidDate = function (transactionID, paidDate, callback) {
    const validationErrors = transactionValidation.getUpdatepaidDateValidation(transactionID, paidDate);
    if (validationErrors.length > 0) {
      callback(validationErrors, []);
      return;
    }
    dataAccessLayerTransactions.updatepaidDate(transactionID, paidDate, function (error, transaction) {
      if (Object.keys(error).length > 0) {
        dbErrorCheck.checkError(error, function (errorCode) {
          callback(errorCode, []);
        });
        return;
      }
      callback([], transaction);
    });
  };

  exports.updateTotalPrice = function (transactionID, totalPrice, callback) {
    const validationErrors = transactionValidation.getUpdateTotalPriceValidation(transactionID, totalPrice);
    if (validationErrors.length > 0) {
      callback(validationErrors, []);
      return;
    }
    dataAccessLayerTransactions.updateTotalPrice(transactionID, totalPrice, function (error, transaction) {
      if (Object.keys(error).length > 0) {
        dbErrorCheck.checkError(error, function (errorCode) {
          callback(errorCode, []);
        });
        return;
      }
      callback([], transaction);
    });
  };

  exports.getTransactionsForCharger = function (connectorID, callback) {
    const validationErrors = transactionValidation.getTransactionsForChargerValidation(connectorID);
    if (validationErrors.length > 0) {
      callback(validationErrors, []);
      return;
    }
    dataAccessLayerTransactions.getTransactionsForCharger(connectorID, function (error, chargerTransaction) {
      if (Object.keys(error).length > 0) {
        dbErrorCheck.checkError(error, function (errorCode) {
          callback(errorCode, []);
        });
        return;
      }
      callback([], chargerTransaction);
    });
  };

  exports.getTransactionForChargeSession = function (chargeSessionID, callback) {
    dataAccessLayerTransactions.getTransactionForChargeSession(chargeSessionID, function (error, chargeSession) {
      if (Object.keys(error).length > 0) {
        dbErrorCheck.checkError(error, function (errorCode) {
          callback(errorCode);
        });
        return;
      }
      callback([], chargeSession);
    });
  };

  return exports;
};
