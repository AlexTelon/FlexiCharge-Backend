const { Sequelize , DataTypes} = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres', 'postgres', {
    host: 'flexicharge.cqjgliexpw2a.eu-west-1.rds.amazonaws.com',
    dialect: "postgres"
  });

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
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    chargePointID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},{
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
        unique: true,
        allowNull: false
    },
    end: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    chargerID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userID: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},{
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
        allowNull: false
    },
    meterStop: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    chargerID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    paymentID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userID: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},{
    timestamps: false
});

sequelize.sync({ force: true });

module.exports = function ({}) {
    const exports = {Chargers, Transactions, Reservations}
    return exports
}

