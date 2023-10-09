module.exports = function ({ dataAccessLayerChargers, dbErrorCheck, chargerValidation, databaseInterfaceElectricityTariffs }) {
  const exports = {};

  exports.getChargers = function (callback) {
    dataAccessLayerChargers.getChargers(function (error, chargers) {
      if (Object.keys(error).length > 0) {
        dbErrorCheck.checkError(error, function (errorCode) {
          callback(errorCode, []);
        });
      } else {
        callback([], chargers);
      }
    });
  };

  exports.getCharger = function (connectorID, callback) {
    const validationErrors = chargerValidation.getChargerValidation(connectorID);
    if (validationErrors.length > 0) {
      callback(validationErrors, []);
      return;
    }
    dataAccessLayerChargers.getCharger(connectorID, function (error, charger) {
      if (Object.keys(error).length > 0) {
        dbErrorCheck.checkError(error, function (errorCode) {
          callback(errorCode, []);
        });
        return;
      }
      if (charger == null) {
        callback([], []);
        return;
      }
      callback([], charger);
    });
  };

  exports.getChargerBySerialNumber = function (serialNumber, callback) {
    const validationErrors = chargerValidation.getChargerBySerialNumberValidation(serialNumber);
    if (validationErrors.length > 0) {
      callback(validationErrors, []);
    } else {
      dataAccessLayerChargers.getChargerBySerialNumber(serialNumber, function (error, charger) {
        if (Object.keys(error).length > 0) {
          dbErrorCheck.checkError(error, function (errorCode) {
            callback(errorCode, []);
          });
        } else {
          if (charger == null) {
            callback([], []);
          } else {
            callback([], charger);
          }
        }
      });
    }
  };

  exports.getAvailableChargers = function (callback) {
    dataAccessLayerChargers.getAvailableChargers(function (error, chargers) {
      if (Object.keys(error).length > 0) {
        dbErrorCheck.checkError(error, function (errorCode) {
          callback(errorCode, []);
        });
        return;
      }
      databaseInterfaceElectricityTariffs.getCurrentElectricityTariff(function (error, tarrif) {
        if (Object.keys(error).length > 0) {
          dbErrorCheck.checkError(error, function (errorCode) {
            callback(errorCode, []);
          });
        } else {
          console.log("Tariff:", tarrif);
          const { price: pricePerKwh } = tarrif.dataValues;
          chargers.forEach((charger) => {
            charger["pricePerKwh"] = pricePerKwh;
          });
          callback([], chargers);
        }
      });

      //   callback([], chargers);
    });
  };

  exports.addCharger = function (chargePointID, serialNumber, coordinates, callback) {
    const ValidationErrors = chargerValidation.getAddChargerValidation(coordinates, serialNumber, chargePointID);
    if (ValidationErrors.length > 0) {
      callback(ValidationErrors, []);
      return;
    }
    dataAccessLayerChargers.addCharger(chargePointID, serialNumber, coordinates, function (error, connectorID) {
      if (Object.keys(error).length > 0) {
        dbErrorCheck.checkError(error, function (errorCode) {
          callback(errorCode, []);
        });
        return;
      }
      callback([], connectorID);
    });
  };

  exports.removeCharger = function (connectorID, callback) {
    const validationErrors = chargerValidation.getRemoveChargerValidation(connectorID);
    if (validationErrors.length > 0) {
      callback(validationErrors, []);
      return;
    }

    dataAccessLayerChargers.removeCharger(connectorID, function (error, chargerRemoved) {
      //chargerRemoved = bool
      if (Object.keys(error).length > 0) {
        dbErrorCheck.checkError(error, function (errorCode) {
          callback(errorCode, chargerRemoved);
        });
        return;
      }
      callback([], chargerRemoved);
    });
  };

  exports.updateChargerStatus = function (connectorID, status, callback) {
    const validationErrors = chargerValidation.getUpdateChargerStatusValidation(status);
    if (validationErrors.length > 0) {
      callback(validationErrors, []);
      return;
    }
    dataAccessLayerChargers.updateChargerStatus(connectorID, status, function (error, charger) {
      if (Object.keys(error).length > 0) {
        dbErrorCheck.checkError(error, function (errorCode) {
          callback(errorCode, []);
        });
        return;
      }
      callback([], charger);
    });
  };

  return exports;
};
