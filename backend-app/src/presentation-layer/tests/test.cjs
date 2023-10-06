require('dotenv').config({ path: '../backend-app/.env' });

const URL = process.env.TEST_URL;
const username = process.env.TEST_USERNAME;
const password = process.env.TEST_PASSWORD;

console.log('URL:', URL);
console.log('USERNAME:', username);
console.log('PASSWORD:', password);