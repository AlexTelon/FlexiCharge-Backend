const reservationValidation = require('../validation/reservationValidation')({})
const {describe, expect, test} = require('@jest/globals')

const startTime = Date.now() + 5000
const endTime = startTime + 10000

describe('Reservation start input:', () => {
    
    test('startTime below minimum', () => {    
        const errors = reservationValidation.getAddReservationValidation(startTime-20000,endTime);
        expect(errors.length).toBe(1);
    });

    test('string as datatype', () => {    
        const errors = reservationValidation.getAddReservationValidation("1",endTime);
        expect(errors.length).toBe(2);
    });

    test('null', () => {
        const errors = reservationValidation.getAddReservationValidation(null,endTime);
        expect(errors.length).toBe(2);
    });

    test('undefined', () => {
        const valErrors = reservationValidation.getAddReservationValidation(undefined,endTime);
        expect(valErrors.length).toBe(1);
    });

});

describe('Reservation stop input:', () => {
    
    test('endtime < starttime', () => {    
        const errors = reservationValidation.getAddReservationValidation(startTime,startTime-1000);
        expect(errors.length).toBe(1);
    });

    test('string as datatype', () => {    
        const errors = reservationValidation.getAddReservationValidation(startTime,"1");
        expect(errors.length).toBe(3);
    });

    test('null', () => {
        const errors = reservationValidation.getAddReservationValidation(startTime,null);
        expect(errors.length).toBe(3);
    });

    test('undefined', () => {
        const valErrors = reservationValidation.getAddReservationValidation(startTime,undefined);
        expect(valErrors.length).toBe(1);
    });

});
