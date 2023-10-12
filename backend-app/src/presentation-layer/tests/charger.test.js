const axios = require('axios');
const { describe, expect, test } = require("@jest/globals");
const config = require('../../config')

const URL = config.TEST_URL;
const username = config.TEST_USER_USERNAME;
const password = config.TEST_USER_PASSWORD;

describe('chargers tests', () => {
  let connectorID = 0;
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

  test('should return a list of charge points', async () => {
    try {
      const response = await axios.get(`${URL}/chargers`);
      expect(response.status).toBe(200);
      // expect(response.data.length).toBe(3103);
    } catch (error) {
      expect(false).toBeTruthy();
    }
  });

  test('post test for the charger', async () => {
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    const data = {
      chargePointID: 1,
      location: [
        57.777714,
        14.16301
      ],
      serialNumber: "testcharger"
    };
    try {
      const response = await axios.post(`${URL}/chargers`, data, { headers });
      connectorID = response.data.connectorID;
      expect(response.status).toBe(201);
    } catch (error) {
      expect(false).toBeTruthy();
    }
  });

  test('should return a specific charger', async () => {
    try {
      const response = await axios.get(`${URL}/chargers/${connectorID}`);
      expect(response.status).toBe(200);
    } catch (error) {
      expect(false).toBeTruthy();
    }
  });

  test('should delete a charger', async () => {
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    try {
      const response = await axios.delete(`${URL}/chargers/${connectorID}`, { headers });
      expect(response.status).toBe(204);
    } catch (error) {
      expect(false).toBeTruthy();
    }
  });

  test('should return all available chargers', async () => {
    try {
      const response = await axios.get(`${URL}/chargers/available`);
      expect(response.status).toBe(200);
      for (const charger of response.data) {
        expect(charger.status).toBe('Available');
      }
    } catch (error) {
      expect(false).toBeTruthy();
    }
  });
});
