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
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}


const Chargers = sequelize.define('Chargers', {
    connectorID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    location: {
        type: DataTypes.ARRAY(DataTypes.FLOAT),
        unique: false,
        allowNull: false
    },
    serialNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

const Reservations = sequelize.define('Reservations', {
    reservationID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    start: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    end: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userID: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

const Transactions = sequelize.define('Transactions', {
    transactionID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    isKlarnaPayment: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    kwhTransfered: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    currentChargePercentage: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    pricePerKwh: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    timestamp: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    paymentID: {
        type: DataTypes.STRING,
        allowNull: true
    },
    userID: {
        type: DataTypes.STRING,
        allowNull: true
    },
    session_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    client_token: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    paymentConfirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    meterStart: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    timestamps: false
});

const ChargePoints = sequelize.define('ChargePoints', {
    chargePointID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    location: {
        type: DataTypes.ARRAY(DataTypes.FLOAT),
        unique: false,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        unique: false,
        allowNull: false
    },
    klarnaReservationAmount: {
        type: DataTypes.INTEGER,
        unique: false,
        allowNull: false
    },
}, {
    timestamps: false
});

Reservations.belongsTo(Chargers, { foreignKey: 'connectorID', onDelete: 'cascade' })
Transactions.belongsTo(Chargers, { foreignKey: 'connectorID', onDelete: 'cascade' })
Chargers.belongsTo(ChargePoints, { foreignKey: 'chargePointID', onDelete: 'cascade' })

sequelize.sync().then(function () {
    ChargePoints.findAndCountAll().then(function ({ rows, count }) {
        if (count < 1) {
            ChargePoints.create({
                name: 'Jönköping University',
                location: [57.777714, 14.163010],
                price: 44.52,
                klarnaReservationAmount: 30000
            });
            ChargePoints.create({
                name: "Nässjö Centralstation",
                location: [57.652328901782795, 14.694810832097543],
                price: 123,
                klarnaReservationAmount: 500
            });
            ChargePoints.create({
                name: "Coop, Forserum",
                location: [57.70022044183724, 14.475150415104222],
                price: 7500,
                klarnaReservationAmount: 500
            });
            ChargePoints.create({
                name: "Airport Parking, Jönköping",
                location: [57.749812214261034, 14.070100435207065],
                price: 100000,
                klarnaReservationAmount: 5000
            });
            Chargers.create({
                connectorID: 100000,
                location: [57.777714, 14.163010],
                serialNumber: 'abc111',
                status: 'Available',
                chargePointID: 1 //Jönköpig University?
            });
            Chargers.create({
                connectorID: 100001,
                location: [57.777714, 14.163010],
                serialNumber: 'abc112',
                status: 'Available',
                chargePointID: 1
            });
            Chargers.create({
                connectorID: 100002,
                location: [57.652328901782795, 14.694810832097543],
                serialNumber: 'abc113',
                status: 'Available',
                chargePointID: 2 //Nässjö Centralstation
            });
            Chargers.create({
                connectorID: 100003,
                location: [57.652328901782795, 14.694810832097543],
                serialNumber: 'abc114',
                status: 'Available',
                chargePointID: 2
            });
            Chargers.create({
                connectorID: 100004,
                location: [57.70022044183724, 14.475150415104222],
                serialNumber: 'abc115',
                status: 'Available',
                chargePointID: 3 //Coop, Forserum
            });
            Chargers.create({
                connectorID: 100005,
                location: [57.749812214261034, 14.070100435207065],
                serialNumber: 'abc116',
                status: 'Available',
                chargePointID: 4 // Airport Parking, Jönköping
            });
            Chargers.create({
                connectorID: 100006,
                location: [57.749812214261034, 14.070100435207065],
                serialNumber: 'abc117',
                status: 'Available',
                chargePointID: 4 // Airport Parking, Jönköping
            });
            Chargers.create({
                connectorID: 100007,
                location: [57.749812214261034, 14.070100435207065],
                serialNumber: 'abc118',
                status: 'Reserved',
                chargePointID: 4 // Airport Parking, Jönköping
            });
            Transactions.create({
                paymentID: null,
                userID: 1, // ?
                connectorID: 100002, // Nässjö
                timestamp: 1663663253,
                isKlarnaPayment: false,
                kwhTransfered: 50,
                currentChargePercentage: 79,
                pricePerKwh: 123
            });
            Transactions.create({
                paymentID: null,
                userID: 1,
                connectorID: 100004, // Coop, forserum
                timestamp: 1663663935,
                isKlarnaPayment: false,
                kwhTransfered: 12,
                currentChargePercentage: 67,
                pricePerKwh: 7500
            });
            Transactions.create({
                paymentID: null,
                userID: 1,
                connectorID: 100005,
                timestamp: 1663664041,
                isKlarnaPayment: false,
                kwhTransfered: 36,
                currentChargePercentage: 82,
                pricePerKwh: 100000
            });
            Transactions.create({
                paymentID: null,
                userID: 1,
                connectorID: 100005,
                timestamp: 1663664109,
                isKlarnaPayment: false,
                kwhTransfered: 12,
                currentChargePercentage: 52,
                pricePerKwh: 100000
            });
            Reservations.create({
                connectorID: 100002,
                userID: 1,
                start: 164966755,
                end: 164968555
            });
        }
    })
})

module.exports = function ({ }) {
    const exports = { Chargers, Transactions, Reservations, ChargePoints }
    return exports
}
