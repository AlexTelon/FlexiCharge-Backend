const dotenv = require("dotenv");
const path = require("path");
const validationSchema = require('./validations');

dotenv.config({path: path.join(__dirname, '../../.env')});

const {error} = validationSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) throw new Error(error);

module.exports = {
  PORT: !parseInt(process.env.PORT) ? 8080 : process.env.PORT,
  AWS_REGION: process.env.AWS_REGION,
  AWS_SECRET_HASH: process.env.AWS_SECRET_HASH,
  AWS_CLIENT_ID: process.env.AWS_CLIENT_ID,
  AWS_ADMIN_USER_POOL: process.env.AWS_ADMIN_USER_POOL,
  AWS_USER_POOL: process.env.AWS_USER_POOL
}