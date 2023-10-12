const { truncate } = require('fs/promises');
const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config');


if (config.USE_LOCAL_DATABASE == 1) {
    var sequelize = new Sequelize('postgres://postgres:abc123@postgre_db:5432/postgredb')
    // sequelize.query('CREATE EXTENSION IF NOT EXISTS postgis', { raw: true })
} else {
    var sequelize = new Sequelize(config.DATABASE_NAME, config.DATABASE_USERNAME, config.DATABASE_PASSWORD, {
        host: config.DATABASE_HOST,
        dialect: "postgres"
    });
}

try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

// Add payment methods here, create a new table for the payment method.
const paymentType = DataTypes.ENUM("Klarna", "Swish", "Mastercard");

const Chargers = sequelize.define('Chargers', {
    connectorID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    location: {
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
      type: DataTypes.DATE,
      allowNull: true,
    },
    endTime: {
      type: DataTypes.DATE,
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
      type: DataTypes.DATEONLY,
      unique: false,
      allowNull: false,
    },
    paymentDueDate: {
      type: DataTypes.DATEONLY,
      unique: false,
      allowNull: true,
    },
    paidDate: {
      type: DataTypes.DATEONLY,
      unique: false,
      allowNull: true,
    },
    totalPrice: {
      type: DataTypes.INTEGER,
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
    location: {
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
    timestamp: {
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
    allowNull: false,
  },
  uuid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cancelled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  dueDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  creationDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  transactionIDs: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: true,
  }
});

ElectricityTariffs.removeAttribute("id");

KlarnaPayments.belongsTo(Transactions, { foreignKey: "transactionID" });
Transactions.belongsTo(ChargeSessions, { foreignKey: "chargeSessionID" });
ChargeSessions.belongsTo(Chargers, {
  foreignKey: "connectorID",
  onDelete: "cascade",
});
Chargers.belongsTo(ChargePoints, {
  foreignKey: "chargePointID",
  onDelete: "cascade",
});

sequelize.sync().then(function () {
  //START--------------------------TEST_DATA
  ChargePoints.findAndCountAll().then(function ({ rows, count }) {
    if (count < 1) {
      ChargePoints.create({
        name: "Airport Parking, Jönköping",
        address: "Flygplansvägen",
        location: [57.749812214261034, 14.070100435207065],
      });
      ChargePoints.create({
        name: "Jönköping University",
        address: "Gjuterigatan 5",
        location: [57.777714, 14.16301],
      });
      ChargePoints.create({
        name: "Nässjö Centralstation",
        address: "Järnvägsgatan 26",
        location: [57.652328901782795, 14.694810832097543],
      });
      ChargePoints.create({
        name: "Coop, Forserum",
        address: "Jönköpingsvägen 2",
        location: [57.70022044183724, 14.475150415104222],
      });
      Chargers.create({
        connectorID: 100000,
        location: [57.777714, 14.16301],
        serialNumber: "testchargeralwaysconnected",
        status: "Available",
        chargePointID: 1, //Jönköping University
      });
      Chargers.create({
        connectorID: 100001,
        location: [57.777714, 14.16301],
        serialNumber: "abc111",
        status: "Available",
        chargePointID: 1, //Jönköping University
      });
      Chargers.create({
        connectorID: 100002,
        location: [57.777714, 14.16301],
        serialNumber: "abc112",
        status: "Available",
        chargePointID: 1, //Jönköping University
      });
      Chargers.create({
        connectorID: 100003,
        location: [57.777714, 14.16301],
        serialNumber: "abc113",
        status: "Available",
        chargePointID: 1, //Jönköping University
      });
      Chargers.create({
        connectorID: 100004,
        location: [57.652328901782795, 14.694810832097543],
        serialNumber: "abc114",
        status: "Available",
        chargePointID: 2, //Nässjö Centralstation
      });
      Chargers.create({
        connectorID: 100005,
        location: [57.652328901782795, 14.694810832097543],
        serialNumber: "abc115",
        status: "Available",
        chargePointID: 2, //Nässjö Centralstation
      });
      Chargers.create({
        connectorID: 100006,
        location: [57.70022044183724, 14.475150415104222],
        serialNumber: "abc116",
        status: "Available",
        chargePointID: 3, //Coop, Forserum
      });
      Chargers.create({
        connectorID: 100007,
        location: [57.749812214261034, 14.070100435207065],
        serialNumber: "abc117",
        status: "Available",
        chargePointID: 4, // Airport Parking, Jönköping
      });
      Chargers.create({
        connectorID: 100008,
        location: [57.749812214261034, 14.070100435207065],
        serialNumber: "abc118",
        status: "Available",
        chargePointID: 4, // Airport Parking, Jönköping
      });
      Chargers.create({
        connectorID: 100009,
        location: [57.749812214261034, 14.070100435207065],
        serialNumber: "abc119",
        status: "Available",
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
        connectorID: 100002, // Jönköping University
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
        connectorID: 100005, // Nässjö centralstation
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
          timestamp: iterTime,
          price: randomPrice(1, 6),
          currency: "SEK",
        });
      }
      //END----------------------------TEST_DATA
    }
  });
});

module.exports = function ({}) {
  const exports = {
    Chargers,
    Transactions,
    ChargePoints,
    ChargeSessions,
    ElectricityTariffs,
    KlarnaPayments,
  };
  return exports;
};
