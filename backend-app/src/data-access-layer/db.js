const { truncate } = require('fs/promises');
const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config')


if(config.USE_LOCAL_DATABASE == 1){
    var sequelize = new Sequelize('postgres://postgres:abc123@postgre_db:5432/postgredb')
    // sequelize.query('CREATE EXTENSION IF NOT EXISTS postgis', { raw: true })
} else {
    var sequelize = new Sequelize('postgres', 'postgres', 'postgres', {
        host: 'flexicharge.cqjgliexpw2a.eu-west-1.rds.amazonaws.com',
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
    chargerID: {
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

Reservations.belongsTo(Chargers, { foreignKey: 'chargerID', onDelete: 'cascade' })
Transactions.belongsTo(Chargers, { foreignKey: 'chargerID', onDelete: 'cascade' })
Chargers.belongsTo(ChargePoints, { foreignKey: 'chargePointID', onDelete: 'cascade' })

/* New database structure from here on down */

// Add payment methods here, create a new table for the payment method.
const paymentType = DataTypes.ENUM('Klarna', 'Swish', 'Mastercard')

const newChargers = sequelize.define('newChargers', {
    chargerID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    coordinates: {
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

const newReservations = sequelize.define('newReservations', {
    reservationID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    startTime: {
        type: DataTypes.INTEGER, // TOOD Should change to dateObject of some sort
        allowNull: false
    },
    endTime: {
        type: DataTypes.INTEGER, // TODO should change to DateObject of some sort
        allowNull: false
    },
    userID: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

const newChargeSessions = sequelize.define('newChargeSessions', {
    chargeSessionID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    userID: {
        type: DataTypes.STRING,
        allowNull: true
    },
    kwhTransfered: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    currentChargePercentage: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    meterStart: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    startTime: {
        type: DataTypes.INTEGER, // TODO should change to DateObject of some sort
        allowNull: true
    },
    endTime: {
        type: DataTypes.INTEGER, // TODO should change to DateObject of some sort
        allowNull: true
    }
}, {
    timestamps: false
})

const newTransactions = sequelize.define('newTransactions', {
    transactionID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    userID: {
        type: DataTypes.STRING,
        allowNull: true
    },
    paymentMethod: {
        type: paymentType,
        allowNull: false
    },
    isPayed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    payNow: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    transactionDate: {
        type: DataTypes.DATE,
        unique: false,
        allowNull: false
    },
    paymentDueDate: {
        type: DataTypes.DATE,
        unique: false,
        allowNull: true
    },
    payedDate: {
        type: DataTypes.DATE,
        unique: false,
        allowNull: true
    },
    totalPrice: {
        type: DataTypes.FLOAT,
        defaultValue: 20, // Default value is strictly for development, remove this.
        allowNull: false
    }
}, {
    timestamps: false
});

const newChargePoints = sequelize.define('newChargePoints', {
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
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    coordinates: {
        type: DataTypes.ARRAY(DataTypes.FLOAT),
        unique: false,
        allowNull: false
    },
}, {
    timestamps: false
});

const newElectricityTariffs = sequelize.define('newElectricityTariffs', {
    date: {
        type: DataTypes.DATE,
        unique: true,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        unique: false,
        allowNull: false
    },
    currency: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: false
    },
}, {
    timestamps: false
});

const klarnaPayments = sequelize.define('KlarnaPayments', {
    paymentID: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    client_token: {
        type: DataTypes.STRING,
        allowNull: false
    },
    session_id: {
        type: DataTypes.STRING,
        allowNull: false
    }
}) 

newElectricityTariffs.removeAttribute('id');

klarnaPayments.belongsTo(newTransactions, { foreignKey: 'transactionID' })
newTransactions.belongsTo(newChargeSessions, { foreignKey: 'chargeSessionID'})
newChargeSessions.belongsTo(newChargers, { foreignKey: 'chargerID', onDelete: 'cascade'})
newChargers.belongsTo(newChargePoints, { foreignKey: 'chargerID', onDelete: 'cascade'})
newReservations.belongsTo(newChargers, {foreignKey: 'chargerID', onDelete: 'cascade'})

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
                location: [57.652328901782795,14.694810832097543],
                price: 123,
                klarnaReservationAmount: 500
            });
            ChargePoints.create({
                name: "Coop, Forserum",
                location: [57.70022044183724,14.475150415104222],
                price: 7500,
                klarnaReservationAmount: 500
            });
            ChargePoints.create({
                name: "Airport Parking, Jönköping",
                location: [57.749812214261034,14.070100435207065],
                price: 100000,
                klarnaReservationAmount: 5000
            });
            Chargers.create({
                chargerID: 100000,
                location: [57.777714, 14.163010],
                serialNumber: 'abc111',
                status: 'Available',
                chargePointID: 1 //Jönköpig University?
            });
            Chargers.create({
                chargerID: 100001,
                location: [57.777714, 14.163010],
                serialNumber: 'abc112',
                status: 'Available',
                chargePointID: 1
            });
            Chargers.create({
                chargerID: 100002,
                location: [57.652328901782795,14.694810832097543],
                serialNumber: 'abc113',
                status: 'Available',
                chargePointID: 2 //Nässjö Centralstation
            });
            Chargers.create({
                chargerID: 100003,
                location: [57.652328901782795,14.694810832097543],
                serialNumber: 'abc114',
                status: 'Available',
                chargePointID: 2
            });
            Chargers.create({
                chargerID: 100004,
                location: [57.70022044183724,14.475150415104222],
                serialNumber: 'abc115',
                status: 'Available',
                chargePointID: 3 //Coop, Forserum
            });
            Chargers.create({
                chargerID: 100005,
                location: [57.749812214261034,14.070100435207065],
                serialNumber: 'abc116',
                status: 'Available',
                chargePointID: 4 // Airport Parking, Jönköping
            });
            Chargers.create({
                chargerID: 100006,
                location: [57.749812214261034,14.070100435207065],
                serialNumber: 'abc117',
                status: 'Available',
                chargePointID: 4 // Airport Parking, Jönköping
            });
            Chargers.create({
                chargerID: 100007,
                location: [57.749812214261034,14.070100435207065],
                serialNumber: 'abc118',
                status: 'Reserved',
                chargePointID: 4 // Airport Parking, Jönköping
            });
            Transactions.create({
                paymentID: null,
                userID: 1, // ?
                chargerID: 100002, // Nässjö
                timestamp: 1663663253,
                isKlarnaPayment: false,
                kwhTransfered: 50,
                currentChargePercentage: 79,
                pricePerKwh: 123
            });
            Transactions.create({
                paymentID: null,
                userID: 1,
                chargerID: 100004, // Coop, forserum
                timestamp: 1663663935,
                isKlarnaPayment: false,
                kwhTransfered: 12,
                currentChargePercentage: 67,
                pricePerKwh: 7500
            });
            Transactions.create({
                paymentID: null,
                userID: 1,
                chargerID: 100005,
                timestamp: 1663664041,
                isKlarnaPayment: false,
                kwhTransfered: 36,
                currentChargePercentage: 82,
                pricePerKwh: 100000
            });
            Transactions.create({
                paymentID: null,
                userID: 1,
                chargerID: 100005,
                timestamp: 1663664109,
                isKlarnaPayment: false,
                kwhTransfered: 12,
                currentChargePercentage: 52,
                pricePerKwh: 100000
            });
            Reservations.create({
                chargerID: 100002,
                userID: 1,
                chargerID: 100004, // Coop, forserum
                timestamp: 1663663935,
                isKlarnaPayment: false,
                kwhTransfered: 12,
                currentChargePercentage: 67,
                pricePerKwh: 7500,
                start: 1,
                end: 2
            });
            Transactions.create({
                paymentID: null,
                userID: 1,
                chargerID: 100005,
                timestamp: 1663664041,
                isKlarnaPayment: false,
                kwhTransfered: 36,
                currentChargePercentage: 82,
                pricePerKwh: 100000
            });
            Transactions.create({
                paymentID: null,
                userID: 1,
                chargerID: 100005,
                timestamp: 1663664109,
                isKlarnaPayment: false,
                kwhTransfered: 12,
                currentChargePercentage: 52,
                pricePerKwh: 100000
            });

            //Fill the ElectricityTariff table with random data
            const generateDays = 61; //Days to generate prices from startDate
            const startDate = new Date(2022, 8, 1); //Sets the start point

            let iterTime = startDate.getTime() //Iteration time
            function randomPrice(min, max) {
                return (Math.random() * (max - min) + min).toFixed(2)
            }
            // Iterates through each hour and sets price+currency from startDate
            for (let hour = 0; hour < 24 * generateDays; hour++) {
                iterTime += 1*60*60*1000
                newElectricityTariffs.create({
                    date: iterTime,
                    price: randomPrice(1, 6),
                    currency: "SEK"
                })
            }
        }
    })
})

module.exports = function ({ }) {
    const exports = { paymentType, Chargers, Transactions, Reservations, ChargePoints, newChargers,
                    newTransactions, newReservations, newChargePoints, newChargeSessions, newElectricityTariffs, klarnaPayments}
    return exports
}
