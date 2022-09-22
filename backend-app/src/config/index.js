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

  USER_POOL_SECRET: process.env.USER_POOL_SECRET,
  USER_POOL_ID: process.env.USER_POOL_ID,
  USER_POOL: process.env.USER_POOL,

  ADMIN_POOL_SECRET: process.env.ADMIN_POOL_SECRET,
  ADMIN_POOL_ID: process.env.ADMIN_POOL_ID,
  ADMIN_POOL: process.env.ADMIN_POOL
}
