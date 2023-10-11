module.exports = function ({ dataAccessLayerChargePoints, dbErrorCheck, chargePointValidation, databaseInterfaceElectricityTariffs }) {
  const exports = {};

  exports.getChargePoint = function (chargePointID, callback) {
    const validationErrors = chargePointValidation.getChargePointValidation(chargePointID);
    if (validationErrors.length > 0) {
      callback(validationErrors, []);
    } else {
      dataAccessLayerChargePoints.getChargePoint(chargePointID, function (error, chargePoint) {
        if (Object.keys(error).length > 0) {
          dbErrorCheck.checkError(error, function (errorCode) {
            callback(errorCode, []);
          });
        } else {
          if (chargePoint == null) {
            callback([], []);
          } else {
            databaseInterfaceElectricityTariffs.getCurrentElectricityTariff(function (error, tarrif) {
              if (Object.keys(error).length > 0) {
                dbErrorCheck.checkError(error, function (errorCode) {
                  callback(errorCode, []);
                });
              } else {
                console.log(tarrif);
                const { price: pricePerKwh } = tarrif.dataValues;

                const formattedPrice = parseInt(pricePerKwh.replace(".", ""));
                chargePoint["price"] = formattedPrice;
                chargePoint["klarnaReservationAmount"] = 0;
                callback([], chargePoint);
              }
            });
          }
        }
      });
    }
  };

  exports.getChargePoints = function (callback) {
    dataAccessLayerChargePoints.getChargePoints(function (error, chargePoints) {
      if (Object.keys(error).length > 0) {
        dbErrorCheck.checkError(error, function (errorCode) {
          callback(errorCode, []);
        });
      } else {
        databaseInterfaceElectricityTariffs.getCurrentElectricityTariff(function (error, tarrif) {
          if (Object.keys(error).length > 0) {
            dbErrorCheck.checkError(error, function (errorCode) {
              callback(errorCode, []);
            });
          } else {
            console.log(tarrif);
            const { price: pricePerKwh } = tarrif.dataValues;

            const formattedPrice = parseInt(pricePerKwh.replace(".", ""));
            chargePoints.forEach((chargePoint) => {
              chargePoint["price"] = formattedPrice;
              chargePoint["klarnaReservationAmount"] = 0;
            });
            callback([], chargePoints);
          }
        });
      }
    });
  };

  exports.addChargePoint = function (name, address, location, callback) {
    const validationErrors = chargePointValidation.getAddChargePointValidation(name, address, location);
    if (validationErrors.length > 0) {
      callback(validationErrors, []);
    } else {
      dataAccessLayerChargePoints.addChargePoint(name, address, location, function (error, chargePointID) {
        if (Object.keys(error).length > 0) {
          dbErrorCheck.checkError(error, function (errorCode) {
            callback(errorCode, []);
          });
        } else {
          callback([], chargePointID);
        }
      });
    }
  };

  exports.removeChargePoint = function (chargePointID, callback) {
    const validationErrors = chargePointValidation.getRemoveChargePointValidation(chargePointID);
    if (validationErrors.length > 0) {
      callback(validationErrors, []);
    } else {
      dataAccessLayerChargePoints.removeChargePoint(chargePointID, function (error, chargePointWasRemoved) {
        if (Object.keys(error).length > 0) {
          dbErrorCheck.checkError(error, function (errorCode) {
            callback(errorCode, chargePointWasRemoved);
          });
        } else {
          callback([], chargePointWasRemoved);
        }
      });
    }
  };

  exports.updateChargePoint = function (chargePointID, name, address, location, callback) {
    const validationErrors = chargePointValidation.getAddChargePointValidation(name, address, location);
    if (validationErrors.length > 0) {
      callback(validationErrors, []);
    } else {
      dataAccessLayerChargePoints.updateChargePoint(chargePointID, name, address, location, function (error, updatedChargePoint) {
        if (Object.keys(error).length > 0) {
          dbErrorCheck.checkError(error, function (errorCode) {
            callback(errorCode, []);
          });
        } else {
          callback([], updatedChargePoint);
        }
      });
    }
  };

  return exports;
};
