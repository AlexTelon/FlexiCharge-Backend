const { truncate } = require("fs/promises");
const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config");

if (config.USE_LOCAL_DATABASE == 1) {
  var sequelize = new Sequelize(
    "postgres://postgres:abc123@postgre_db:5432/postgredb"
  );
  // sequelize.query('CREATE EXTENSION IF NOT EXISTS postgis', { raw: true })
} else {
  var sequelize = new Sequelize("postgres", "postgres", "flexi2022Charge1337", {
    host: "flexicharge.cqjgliexpw2a.eu-west-1.rds.amazonaws.com",
    dialect: "postgres",
  });
}

try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

// //START--------------------------OLD_CODE_CURRENTLY_USED
// const Chargers = sequelize.define('Chargers', {
//     chargerID: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         allowNull: false
//     },
//     location: {
//         type: DataTypes.ARRAY(DataTypes.FLOAT),
//         unique: false,
//         allowNull: false
//     },
//     serialNumber: {
//         type: DataTypes.STRING,
//         unique: true,
//         allowNull: false
//     },
//     status: {
//         type: DataTypes.STRING,
//         allowNull: false
//     }
// }, {
//     timestamps: false
// });

// const Reservations = sequelize.define('Reservations', {
//     reservationID: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//         allowNull: false
//     },
//     start: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     },
//     end: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     },
//     userID: {
//         type: DataTypes.STRING,
//         allowNull: false
//     }
// }, {
//     timestamps: false
// });

// const Transactions = sequelize.define('Transactions', {
//     transactionID: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//         allowNull: false
//     },
//     isKlarnaPayment: {
//         type: DataTypes.BOOLEAN,
//         allowNull: false
//     },
//     kWhTransferred: {
//         type: DataTypes.FLOAT,
//         allowNull: true
//     },
//     currentChargePercentage: {
//         type: DataTypes.FLOAT,
//         allowNull: true
//     },
//     pricePerKwh: {
//         type: DataTypes.DECIMAL(10, 2),
//         allowNull: false
//     },
//     timestamp: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     },
//     paymentID: {
//         type: DataTypes.STRING,
//         allowNull: true
//     },
//     userID: {
//         type: DataTypes.STRING,
//         allowNull: true
//     },
//     session_id: {
//         type: DataTypes.STRING,
//         allowNull: true
//     },
//     client_token: {
//         type: DataTypes.TEXT,
//         allowNull: true
//     },
//     paymentConfirmed: {
//         type: DataTypes.BOOLEAN,
//         allowNull: true
//     },
//     meterStart: {
//         type: DataTypes.INTEGER,
//         allowNull: true
//     }
// }, {
//     timestamps: false
// });

// const ChargePoints = sequelize.define('ChargePoints', {
//     chargePointID: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//         allowNull: false
//     },
//     name: {
//         type: DataTypes.STRING,
//         unique: true,
//         allowNull: false
//     },
//     location: {
//         type: DataTypes.ARRAY(DataTypes.FLOAT),
//         unique: false,
//         allowNull: false
//     },
//     price: {
//         type: DataTypes.DECIMAL(10, 2),
//         unique: false,
//         allowNull: false
//     },
//     klarnaReservationAmount: {
//         type: DataTypes.INTEGER,
//         unique: false,
//         allowNull: false
//     },
// }, {
//     timestamps: false
// });

// Reservations.belongsTo(Chargers, { foreignKey: 'chargerID', onDelete: 'cascade' })
// Transactions.belongsTo(Chargers, { foreignKey: 'chargerID', onDelete: 'cascade' })
// Chargers.belongsTo(ChargePoints, { foreignKey: 'chargePointID', onDelete: 'cascade' })
// //END---------------------------OLD_CODE_CURRENTLY_USED

//START--------------------------NEW_CODE_CURRENTLY_UNUSED

// Add payment methods here, create a new table for the payment method.
const paymentType = DataTypes.ENUM("Klarna", "Swish", "Mastercard");

const Chargers = sequelize.define(
  "Chargers",
  {
    chargerID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    coordinates: {
      type: DataTypes.ARRAY(DataTypes.FLOAT),
      unique: false,
      allowNull: false,
    },
    serialNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

const Reservations = sequelize.define(
  "Reservations",
  {
    reservationID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

const ChargeSessions = sequelize.define(
  "ChargeSessions",
  {
    chargeSessionID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userID: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    kWhTransferred: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    currentChargePercentage: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    meterStart: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    startTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    endTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

const Transactions = sequelize.define(
  "Transactions",
  {
    transactionID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userID: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentMethod: {
      type: paymentType,
      allowNull: false,
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    payNow: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    transactionDate: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false,
    },
    paymentDueDate: {
      type: DataTypes.DATE,
      unique: false,
      allowNull: true,
    },
    paidDate: {
      type: DataTypes.DATE,
      unique: false,
      allowNull: true,
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

const ChargePoints = sequelize.define(
  "ChargePoints",
  {
    chargePointID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    coordinates: {
      type: DataTypes.ARRAY(DataTypes.FLOAT),
      unique: false,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

const ElectricityTariffs = sequelize.define(
  "ElectricityTariffs",
  {
    date: {
      type: DataTypes.DATE,
      unique: true,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      unique: false,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

const KlarnaPayments = sequelize.define("KlarnaPayments", {
  klarnaPaymentID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  order_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  client_token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  session_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const UserInvoices = sequelize.define("UserInvoices", {
  userID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  invoiceUUID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

ElectricityTariffs.removeAttribute("id");

KlarnaPayments.belongsTo(Transactions, { foreignKey: "transactionID" });
Transactions.belongsTo(ChargeSessions, { foreignKey: "chargeSessionID" });
ChargeSessions.belongsTo(Chargers, {
  foreignKey: "chargerID",
  onDelete: "cascade",
});
Chargers.belongsTo(ChargePoints, {
  foreignKey: "chargePointID",
  onDelete: "cascade",
});
Reservations.belongsTo(Chargers, {
  foreignKey: "chargerID",
  onDelete: "cascade",
});
//END--------------------------NEW_CODE_CURRENTLY_UNUSED

sequelize.sync().then(function () {
  //START--------------------------TEST_DATA_NEW_CODE
  ChargePoints.findAndCountAll().then(function ({ rows, count }) {
    if (count < 1) {
      ChargePoints.create({
        name: "Airport Parking, Jönköping",
        address: "Flygplansvägen",
        coordinates: [57.749812214261034, 14.070100435207065],
      });
      ChargePoints.create({
        name: "Jönköping University",
        address: "Gjuterigatan 5",
        coordinates: [57.777714, 14.16301],
      });
      ChargePoints.create({
        name: "Nässjö Centralstation",
        address: "Järnvägsgatan 26",
        coordinates: [57.652328901782795, 14.694810832097543],
      });
      ChargePoints.create({
        name: "Coop, Forserum",
        address: "Jönköpingsvägen 2",
        coordinates: [57.70022044183724, 14.475150415104222],
      });
      Chargers.create({
        chargerID: 100001,
        coordinates: [57.777714, 14.16301],
        serialNumber: "abc111",
        status: "Available",
        chargePointID: 1, //Jönköping University
      });
      Chargers.create({
        chargerID: 100002,
        coordinates: [57.777714, 14.16301],
        serialNumber: "abc112",
        status: "Available",
        chargePointID: 1, //Jönköping University
      });
      Chargers.create({
        chargerID: 100003,
        coordinates: [57.777714, 14.16301],
        serialNumber: "abc113",
        status: "Available",
        chargePointID: 1, //Jönköping University
      });
      Chargers.create({
        chargerID: 100004,
        coordinates: [57.652328901782795, 14.694810832097543],
        serialNumber: "abc114",
        status: "Available",
        chargePointID: 2, //Nässjö Centralstation
      });
      Chargers.create({
        chargerID: 100005,
        coordinates: [57.652328901782795, 14.694810832097543],
        serialNumber: "abc115",
        status: "Available",
        chargePointID: 2, //Nässjö Centralstation
      });
      Chargers.create({
        chargerID: 100006,
        coordinates: [57.70022044183724, 14.475150415104222],
        serialNumber: "abc116",
        status: "Available",
        chargePointID: 3, //Coop, Forserum
      });
      Chargers.create({
        chargerID: 100007,
        coordinates: [57.749812214261034, 14.070100435207065],
        serialNumber: "abc117",
        status: "Available",
        chargePointID: 4, // Airport Parking, Jönköping
      });
      Chargers.create({
        chargerID: 100008,
        coordinates: [57.749812214261034, 14.070100435207065],
        serialNumber: "abc118",
        status: "Available",
        chargePointID: 4, // Airport Parking, Jönköping
      });
      Chargers.create({
        chargerID: 100009,
        coordinates: [57.749812214261034, 14.070100435207065],
        serialNumber: "abc119",
        status: "Reserved",
        chargePointID: 4, // Airport Parking, Jönköping
      });
      Transactions.create({
        userID: "NotARealUser@gmail.com",
        paymentMethod: "Klarna",
        isPaid: true,
        payNow: false,
        transactionDate: 1664889622,
        paymentDueDate: 1664889622,
        paidDate: 1664889622,
        totalPrice: 100,
        chargerID: 100002, // Jönköping University
      });
      Transactions.create({
        userID: "NotARealUser@gmail.com",
        paymentMethod: "Klarna",
        isPaid: true,
        payNow: false,
        transactionDate: 1664889622,
        paymentDueDate: 1664889622,
        paidDate: 1664889622,
        totalPrice: 151,
        chargerID: 100005, // Nässjö centralstation
      });
      // Fill the ElectricityTariff table with random data
      const generateDays = 61; //Days to generate prices from startDate
      const startDate = new Date(2022, 8, 1); //Sets the start point

      let iterTime = startDate.getTime(); //Iteration time
      function randomPrice(min, max) {
        return (Math.random() * (max - min) + min).toFixed(2);
      }
      // Iterates through each hour and sets price+currency from startDate
      for (let hour = 0; hour < 24 * generateDays; hour++) {
        iterTime += 1 * 60 * 60 * 1000;
        ElectricityTariffs.create({
          date: iterTime,
          price: randomPrice(1, 6),
          currency: "SEK",
        });
      }
      //END----------------------------TEST_DATA_NEW_CODE
    }
  });
});

module.exports = function ({}) {
  const exports = {
    Chargers,
    Transactions,
    Reservations,
    ChargePoints,
    ChargeSessions,
    ElectricityTariffs,
    KlarnaPayments,
  };
  return exports;
};
