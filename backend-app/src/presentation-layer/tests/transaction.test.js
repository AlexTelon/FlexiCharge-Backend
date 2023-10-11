const axios = require('axios');
const { describe, expect, test } = require("@jest/globals");
const config = require('../../config')

const URL = config.TEST_URL;
const username = config.TEST_USER_USERNAME;
const password = config.TEST_USER_PASSWORD;

describe('transaction tests', () => {
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

  test('should create a transaction', async () => {
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    const data = {
      "connectorID": 100_000,
      "paymentType": "klarna"
    }
    try {
      const response = await axios.post(`${URL}/transaction`, data, { headers });
      expect(response.status).toBe(201);
    } catch (error) {
      expect(false).toBeTruthy();
    }
  });

  test('should start a transaction', async () => {
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    try {
      const response = await axios.put(`${URL}/transaction/start/9999`, { }, { headers });
      expect(response.status).toBe(200);
    } catch (error) {
      expect(false).toBeTruthy();
    }
  });

  test('should return the status of a transaction', async () => {
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    try {
      const response = await axios.get(`${URL}/transaction/9999`, { headers });
      expect(response.status).toBe(200);
    } catch (error) {
      expect(false).toBeTruthy();
    }
  });

  test('should stop a transaction', async () => {
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    try {
      const response = await axios.put(`${URL}/transaction/stop/9999`, { }, { headers });
      expect(response.status).toBe(200);
    } catch (error) {
      expect(false).toBeTruthy();
    }
  });

  test('should return user transaction by userID', async () => {
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    // try {
    //   const response = await axios.get(`${URL}/transaction/user/1`, { headers });
    //   expect(response.status).toBe(200);
    // } catch (exception) {
    //   console.error(exception);
    // }
  });
});
