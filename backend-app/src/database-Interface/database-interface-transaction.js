module.exports = function ({ dataAccessLayerTransactions, databaseInterfaceChargeSessions, transactionValidation, dbErrorCheck, ocppInterface }) {

    const exports = {}

    exports.addTransaction = function (chargeSessionID, userID, connectorID, paymentMethod, callback) {
        // TODO: Fix validation
        const validationErrors = true || transactionValidation.getAddTransactionValidation(chargeSessionID, userID, payNow)
        if (validationErrors.length > 0) {
            callback(validationErrors, [])
            return
        }
        else {
            connectorID = connectorID;
            const idTag = 0;
            const parentIdTag = 0; // Optional according to OCPP

            ocppInterface.reserveNow(connectorID, idTag, parentIdTag, function (error, returnObject) {
                if (error != null || returnObject.status == "Rejected") {
                    callback(["couldNotReserveCharger"], [])
                } else {
                    dataAccessLayerTransactions.addTransaction(chargeSessionID, userID, paymentMethod, function (error, transaction) {
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

            console.log('dit-sat_0', 'hej')
            console.log('dit-sat_1', transaction)

            ocppInterface.remoteStartTransaction(transaction['ChargeSession.connectorID'], transaction.transactionID, function (error, returnObject) {
                if (error != null || returnObject.status == "Rejected") {
                    console.error('Error:', error, returnObject);
                    callback(["couldNotStartTransaction"], []);
                    return;
                }

                console.log('dit-sat_2', transaction, returnObject);

                const timestamp = returnObject.timestamp;
                const meterStart = returnObject.meterStart;

                databaseInterfaceChargeSessions.startChargeSession(transaction.chargeSessionID, timestamp, meterStart, function (error, updatedChargeSession) {
                    if (Object.keys(error).length > 0) {
                        dbErrorCheck.checkError(error, function (errorCode) {
                            callback(errorCode, [])
                        })
                        return
                    }

                    console.log('dit-sat_3', updatedChargeSession, transaction);

                    for(key in updatedChargeSession) {
                        console.log('dit-sat_4', 'Key', key, 'val', updatedChargeSession[key])
                        transaction[`ChargeSession.${key}`] = updatedChargeSession[key];
                    }

                    console.log('dit-sat_5', transaction);

                    callback([], transaction);
                });

            });
        });
    };

    exports.stopTransaction = function (transactionID, callback) {
        const validationErrors = transactionValidation.getTransactionValidation(transactionID);
        if (validationErrors.length > 0) {
            callback(validationErrors, []);
            return;
        }

        dataAccessLayerTransactions.getTransaction(transactionID, function (error, transaction) {
            console.log('dit-sot_0', error, transaction)
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

            // Uppdatera ChargeSession med endTime.

            ocppInterface.remoteStopTransaction(transaction['ChargeSession.connectorID'], transaction.transactionID, function (error, returnObject) {
                if (error != null || returnObject.status == "Rejected") {
                    console.error('Error:', error, returnObject);
                    callback(["couldNotStopTransaction"], []);
                    return;
                }

                console.log('dit-sot_1', transaction, returnObject);

                const timestamp = returnObject.timestamp;
                const kWhTransferred = (returnObject.meterStop - transaction['ChargeSession.meterStart']) / 1000;

                databaseInterfaceChargeSessions.endChargeSession(transaction.chargeSessionID, timestamp, kWhTransferred, function (error, transaction, updatedChargeSession) {
                    if (Object.keys(error).length > 0) {
                        dbErrorCheck.checkError(error, function (errorCode) {
                            callback(errorCode, [])
                        })
                        return
                    }

                    console.log('dit-sot_3', updatedChargeSession, transaction);

                    for(key in updatedChargeSession) {
                        console.log('dit-sot_4', 'Key', key, 'val', updatedChargeSession[key])
                        transaction[`ChargeSession.${key}`] = updatedChargeSession[key];
                    }

                    console.log('dit-sot_5', transaction);

                    callback([], transaction);
                });
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
