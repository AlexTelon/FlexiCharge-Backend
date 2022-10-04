const reservationValidation = require('../validation/reservationValidation')({})
const {describe, expect, test} = require('@jest/globals')

const validStopInput = 0
const validStartInput = 0

describe('Reservation start input:', () => {
    
    test('integer below 0', () => {    
        const errors = reservationValidation.getAddReservationValidation(-1,validStopInput);
        expect(errors.length).toBe(1);
    });

    test('string as datatype', () => {    
        const errors = reservationValidation.getAddReservationValidation("1",validStopInput);
        expect(errors.length).toBe(1);
    });

    test('null', () => {
        const errors = reservationValidation.getAddReservationValidation(null,validStopInput);
        expect(errors.length).toBe(1);
    });

    test('undefined', () => {
        const valErrors = reservationValidation.getAddReservationValidation(undefined,validStopInput);
        expect(valErrors.length).toBe(1);
    });

});

describe('Reservation stop input:', () => {
    
    test('integer below 0', () => {    
        const errors = reservationValidation.getAddReservationValidation(validStartInput,-1);
        expect(errors.length).toBe(1);
    });

    test('string as datatype', () => {    
        const errors = reservationValidation.getAddReservationValidation(validStartInput,"1");
        expect(errors.length).toBe(1);
    });

    test('null', () => {
        const errors = reservationValidation.getAddReservationValidation(validStartInput,null);
        expect(errors.length).toBe(1);
    });

    test('undefined', () => {
        const valErrors = reservationValidation.getAddReservationValidation(validStartInput,undefined);
        expect(valErrors.length).toBe(1);
    });

});

describe('Reservation start < end:', () => {
    
    test('string as datatype for both parameters', () => {    
        const errors = reservationValidation.getAddReservationValidation("1","1");
        expect(errors.length).toBe(1);
    });

    test('start > end', () => {
        const errors = reservationValidation.getAddReservationValidation(2,1);
        expect(errors.length).toBe(1);
    });

    test('start < end', () => {
        const errors = reservationValidation.getAddReservationValidation(1,2);
        expect(errors.length).toBe(0);
    });

});