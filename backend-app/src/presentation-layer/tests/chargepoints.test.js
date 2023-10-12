const axios = require('axios');
const { describe, expect, test } = require("@jest/globals");
const config = require('../../config')

const URL = config.TEST_URL;
const username = config.TEST_USER_USERNAME;
const password = config.TEST_USER_PASSWORD;

describe('All ChargerPoints tests', () => {
  let chargePointID = 0;
  let token = '';

  test('should log in', async () => {
    try {
      const response = await axios.post(`${URL}/auth/sign-in`, {
        username: username,
        password: password
      });
      token = response.data.accessToken;
      expect(token).toBeDefined();
    } catch(error) {
      expect(false).toBeTruthy();
    }
  });

  test('should return all ChargerPoints', async () => {
    try {
      const response = await axios.get(`${URL}/chargePoints`);
      expect(response.status).toBe(200);
    } catch(error) {
      expect(false).toBeTruthy();
    }
  });

  test('should return a new ChargerPoint', async () => {
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    const data = {
      "name": "Test ChargePoint",
      "location": [
        10,
        10
      ],
      "price": 10,
      "address": "Somewhere",
      "klarnaReservationAmount": 10
    };
    try {
      const response = await axios.post(`${URL}/chargePoints`, data, { headers });
      chargePointID = response.data.chargePointID;
      expect(response.status).toBe(201);
    } catch(error) {
      expect(false).toBeTruthy();
    }
  });

  test('should return ChargePoint by id', async () => {
    try {
      const response = await axios.get(`${URL}/chargePoints/${chargePointID}`);
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
    } catch(error) {
      expect(false).toBeTruthy();
    }
  });

  // test('should return an updated ChargerPoint', async () => {
  //   //TODO: endpoint doesn't work
  // });

  test('should delete ChargePoint by id', async () => {
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    try {
      const response = await axios.delete(`${URL}/chargePoints/${chargePointID}`, { headers });
      expect(response.status).toBe(204);
    } catch(error) {
      expect(false).toBeTruthy();
    }
  });
});
