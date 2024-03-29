const axios = require('axios');
const { describe, expect, test } = require("@jest/globals");
const config = require('../../config')

const URL = config.TEST_URL;
const username = config.TEST_USER_USERNAME;
const password = config.TEST_USER_PASSWORD;

describe('All invoices tests', () => {
  let token = '';

  test('should log in', async () => {
    const response = await axios.post(`${URL}/auth/sign-in`, {
      username: username,
      password: password
    });
    token = response.data.accessToken;
  });

  // test('should create an invoice', async () => {
  //   const headers = {
  //     'Authorization': `Bearer ${token}`
  //   };
  //   const response = await axios.post(`${URL}/invoices`, { headers });
  //   expect(response.status).toBe(200);
  // });

  // test('should get the invoice by invoiceID', async () => {
  //   const token = await login();
  //   const headers = {
  //     'Authorization': `Bearer ${token}`
  //   };
  //   const response = await axios.get(`${URL}/invoices/1`, { headers });
  //   expect(response.status).toBe(200);
  // });

  // test('should return all invoices', async () => {
  //   const token = await login();
  //   const headers = {
  //     'Authorization': `Bearer ${token}`
  //   };
  //   const response = await axios.get(`${URL}/invoices`, { headers });
  //   expect(response.status).toBe(200);
  // });

  // test('should return all invoices by userID', async () => {
  //   const token = await login();
  //   const headers = {
  //     'Authorization': `Bearer ${token}`
  //   };
  //   const response = await axios.get(`${URL}/invoices/user/1`, { headers });
  //   expect(response.status).toBe(200);
  // });
});
