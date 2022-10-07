const SequelizeMock = require('sequelize-mock')

module.exports = function({newDatabaseInterfaceReservations}) {
    const exports = {}

    const DBConnectionMock = new SequelizeMock();
    let Reservations = DBConnectionMock.define('newReservations', {
        reservationID: 1,
        startTime: 1,
        endTime: "Klarna",
        userID: 1337,
        chargerID: 1338
    })

    exports.getReservationTest = function(reservationID, callback) {
        newDatabaseInterfaceReservations.getReservation(reservationID, Reservations, (error, reservation) => {
            const errorList = []

            error.forEach(err => {
                errorList.push(err)
            });

            if (reservation.dataValues.userID !== 1337) {
                errorList.push("Did not fetch correct reservation!")
            }

            callback(errorList)
        })
    }

    exports.getReservationsForChargerTest = function(chargerID, callback) {
        newDatabaseInterfaceReservations.getReservationsForCharger(chargerID, Reservations, (error, reservation) => {
            const errorList = []

            error.forEach(err => {
                errorList.push(err)
            });

            if (reservation[0].dataValues.chargerID !== chargerID) {
                errorList.push("Fetched wrong reservation")
            }

            callback(errorList)
        })
    }

    exports.getReservationsForUserTest = function(userID, callback) {
        newDatabaseInterfaceReservations.getReservationsForUser(userID, Reservations, (error, reservation) => {
            const errorList = []

            error.forEach(err => {
                errorList.push(err)
            });

            if (reservation[0].dataValues.userID !== userID) {
                errorList.push("Fetched wrong reservation")
            }

            callback(errorList)
        })
    }

    exports.addReservationTest = function(chargerID, userID, start, end, callback) {
        newDatabaseInterfaceReservations.addReservation(chargerID, userID, start, end, Reservations, (error, reservationID) => {
            const errorList = []

            error.forEach(err => {
                errorList.push(err)
            });

            if (reservationID == null) {
                errorList.push("No reservationID was sent back, indicating reservation could not be added to database")
            }

            callback(errorList)
        })
    }

    exports.removeReservationTest = function(reservationID, callback) {
        newDatabaseInterfaceReservations.removeReservation(reservationID, Reservations, (error, removeReservation) => {
            const errorList = []

            error.forEach(err => {
                errorList.push(err)
            });

            if (removeReservation == false) {
                errorList.push(`Reservation with id : ${reservationID} did not get removed.`)
            }

            callback(errorList)
        })
    }

    exports.runTests = function() {
        const FailedTests = []
        let amountOfTestsDone = 0
        let totalTests = Object.keys(exports).length - 1

        const checkIfAllTestsAreDone = function() {
            amountOfTestsDone++

            if (amountOfTestsDone >= totalTests) {
                if (FailedTests.length == 0) {
                    console.log(`All Reservations Tests succeeded!`);
                } else {
                    console.log(`Reservation Tests had ${FailedTests.length} failed tests!`);
                    FailedTests.forEach(message => {
                        console.log(message);
                    });
                }
            }
        }

        exports.getReservationTest(10, (errors) => {
            errors.forEach(e => {
                FailedTests.push(`getReservationTest Failed ! ${e}`)
            })

            checkIfAllTestsAreDone()
        })

        exports.getReservationsForChargerTest(1338, (errors) => {
            errors.forEach(e => {
                FailedTests.push(`getReservationsForChargerTest Failed ! ${e}`)
            })

            checkIfAllTestsAreDone()
        })

        exports.getReservationsForUserTest(1337, (errors) => {
            errors.forEach(e => {
                FailedTests.push(`getReservationsForUserTest Failed ! ${e}`)
            })

            checkIfAllTestsAreDone()
        })

        exports.addReservationTest(1338, 1337, 1, 10, (errors) => {
            errors.forEach(e => {
                FailedTests.push(`addReservation Failed ! ${e}`)
            })

            checkIfAllTestsAreDone()
        })

        exports.removeReservationTest(1, (errors) => {
            errors.forEach(e => {
                FailedTests.push(`removeReservation Failed ! ${e}`)
            })

            checkIfAllTestsAreDone()
        })
    }

    return exports
}