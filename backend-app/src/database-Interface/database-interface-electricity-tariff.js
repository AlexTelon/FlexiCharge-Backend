module.exports = function ({ dataAccessLayerElectricityTariffs, dbErrorCheck }) {
  const exports = {};

  exports.getElectricityTariffsOrderByDate = function (callback) {
    dataAccessLayerElectricityTariffs.getElectricityTariffsOrderByDate(callback);
  };

  exports.generateCurrentElectricityTariff = function (callback) {
    const maxPrice = 6.0;
    const minPrice = 0.5;

    let currentDate = new Date();
    currentDate.setMinutes(0, 0, 0);
    const timestamp = new Date(currentDate.getTime()).toISOString();

    const price = (Math.random() * (maxPrice - minPrice) + minPrice).toFixed(2);
    dataAccessLayerElectricityTariffs.addElectricityTariff(timestamp, price, "SEK", (error, tariff) => {
      if (error.length > 0) {
        callback(error, []);
        return;
      }
      callback([], tariff);
    });
  };

  exports.generateElectricityTariffs = function (offset, callback) {
    const generateDays = 30;
    const maxPrice = 6.0;
    const minPrice = 0.5;
    offsetDate = new Date();
    offsetDate.setTime(offsetDate.getTime() + offset * 60 * 60 * 1000);
    const startDate = new Date(offsetDate);
    startDate.setMinutes(0, 0, 0);
    let iterationTime = startDate.getTime();
    const promises = [];

    for (var hour = startDate.getHours(); hour < 24 * generateDays; hour++) {
      price = (Math.random() * (maxPrice - minPrice) + minPrice).toFixed(2);
      promises.push(
        dataAccessLayerElectricityTariffs.addElectricityTariff(new Date(iterationTime).toISOString(), price, "SEK", function (error, result) {
          if (error) console.error(error);
        })
      );
      iterationTime += 1 * 60 * 60 * 1000;
    }
    Promise.all(promises)
      .then(function (tariffs) {
        callback([], tariffs);
      })
      .catch((e) => {
        console.log(e);
        callback(e, []);
      });
  };

  exports.getCurrentElectricityTariff = function (callback) {
    let currentDate = new Date();
    currentDate.setMinutes(0, 0, 0);
    const queryDate = new Date(currentDate).toISOString();
    dataAccessLayerElectricityTariffs.getElectricityTariffByDate(queryDate, function (error, tariff) {
      if (Object.keys(error).length > 0) {
        dbErrorCheck.checkError(error, function (errorCode) {
          callback(errorCode, []);
        });
      } else {
        if (tariff != null) {
          callback([], tariff);
        } else {
          exports.generateCurrentElectricityTariff(function (error, newTariff) {
            if (Object.keys(error).length > 0) {
              dbErrorCheck.checkError(error, function (errorCode) {
                callback(errorCode, []);
              });
            } else {
              callback([], newTariff);
            }
          });
        }
      }
    });
  };

  return exports;
};
