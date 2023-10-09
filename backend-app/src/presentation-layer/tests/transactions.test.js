const axios = require('axios');
const { describe, expect, test } = require("@jest/globals");
const config = require('../../config')

const URL = config.TEST_URL;
const username = config.TEST_USER_USERNAME;
const password = config.TEST_USER_PASSWORD;

describe('transactions tests', () => {
  let token = '';

  test('should log in', async () => {
    const response = await axios.post(`${URL}/auth/sign-in`, {
      username: username,
      password: password
    });
    token = response.data.accessToken;
  });

  test('should create a transaction', async () => {
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    const data = {
      "connectorID": 100000,
      "isKlarnaPayment": true
    }
    const response = await axios.post(`${URL}/transactions`, data, { headers });
    expect(response.status).toBe(201);
  });

  test('should start a transaction', async () => {
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    const response = await axios.put(`${URL}/transactions/start/9999`, { headers });
    expect(response.status).toBe(200);
  });

  test('should return the status of a transaction', async () => {
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    const response = await axios.get(`${URL}/transactions/9999`, { headers });
    expect(response.status).toBe(200);
  });

  test('should stop a transaction', async () => {
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    const response = await axios.put(`${URL}/transactions/stop/9999`, { headers });
    expect(response.status).toBe(200);
  });

  // test('should return user transactions by userID', async () => {
  //   const headers = {
  //     'Authorization': `Bearer ${token}`
  //   };
  //   const response = await axios.get(`${URL}/transactions/user/1`, { headers });
  //   expect(response.status).toBe(200);
  // });
});
