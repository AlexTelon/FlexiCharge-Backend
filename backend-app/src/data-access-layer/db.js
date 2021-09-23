const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres', 'postgres', {
    host: 'flexicharge.cqjgliexpw2a.eu-west-1.rds.amazonaws.com',
    dialect: "postgres"
});
// const sequelize = new Sequelize('postgres://postgres:abc123@postgre_db:5432/postgredb')

//sequelize.query('CREATE EXTENSION IF NOT EXISTS postgis', { raw: true })

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
        autoIncrement: true,
        allowNull: false
    },
    location: {
        type: DataTypes.ARRAY(DataTypes.FLOAT),
        unique: false,
        allowNull: false
    },
    chargePointID: {
        type: DataTypes.INTEGER,
        unique: false,
        allowNull: false
    },
    serialNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
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
        type: DataTypes.INTEGER,
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
    meterStart: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    meterStop: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    timestamp: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    paymentID: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    userID: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
});

Reservations.hasOne(Reservations, { foreignKey: 'chargerID', onDelete: 'cascade' })
Reservations.belongsTo(Chargers, { foreignKey: 'chargerID', onDelete: 'cascade' })

Transactions.hasOne(Transactions, { foreignKey: 'chargerID', onDelete: 'cascade' })
Transactions.belongsTo(Chargers, { foreignKey: 'chargerID', onDelete: 'cascade' })

sequelize.sync().then(function() {
    Chargers.findAndCountAll().then(function({ rows, count }) {
        if (count < 1) {
            Chargers.create({
                location: [57.777714, 14.163010],
                serialNumber: 'abc123',
                chargePointID: 1,
                status: 1
            });
            Chargers.create({
                location: [57.777725, 14.163085],
                serialNumber: '123abc',
                chargePointID: 1,
                status: 0
            });
            Transactions.create({
                chargerID: 1,
                meterStart: 1631521252,
                meterStop: 1631522000,
                paymentID: 1,
                userID: 1,
                timestamp: 1631522252
            });
            Reservations.create({
                chargerID: 1,
                userID: 1,
                start: 164966755,
                end: 164968555
            });
        }
    })
})

module.exports = function({}) {
    const exports = { Chargers, Transactions, Reservations }
    return exports
}