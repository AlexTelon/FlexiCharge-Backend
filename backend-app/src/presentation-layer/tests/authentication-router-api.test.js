const axios = require('axios');
const { describe, expect, test } = require("@jest/globals");

const URL = "http://18.202.253.30:8080"

describe('Authentication Router API', () => {
  describe('POST /sign-in', () => {
    test('should return a 200 status code and a token when valid credentials are provided', async () => {
      const response = await axios.post(URL + '/auth/sign-in', {
        username: 'gesubyiqzlhltwutws@ckptr.com',
        password: 'Test12345!'
      });
      expect(response.status).toBe(200);
    });

    test('should return a 404 status code when invalid credentials are provided', async () => {
      try {
        await axios.post(URL + '/sign-in', {
          username: 'testuser@test.com',
          password: 'wrongpassword'
        });
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });
  });
});