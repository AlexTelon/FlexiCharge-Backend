const dotenv = require("dotenv");
const path = require("path");
const validationSchema = require('./validations');

dotenv.config({path: path.join(__dirname, '../../.env')});

const {error} = validationSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) throw new Error(error);

module.exports = {
  USE_LOCAL_DATABASE: process.env.USE_LOCAL_DATABASE,

  PORT: !parseInt(process.env.PORT) ? 8080 : process.env.PORT,

  AWS_REGION: process.env.AWS_REGION,

  USER_POOL_SECRET: process.env.USER_POOL_SECRET,
  USER_POOL_ID: process.env.USER_POOL_ID,
  USER_POOL: process.env.USER_POOL,

  ADMIN_POOL_SECRET: process.env.ADMIN_POOL_SECRET,
  ADMIN_POOL_ID: process.env.ADMIN_POOL_ID,
  ADMIN_POOL: process.env.ADMIN_POOL,
  
  RUN_OCPP_TEST: !parseInt(process.env.RUN_OCPP_TEST) ? 0 : process.env.RUN_OCPP_TEST,
  LIVEMETRICS_DB_UPDATE_INTERVAL: !parseInt(process.env.LIVEMETRICS_DB_UPDATE_INTERVAL) ? 30000 : process.env.LIVEMETRICS_DB_UPDATE_INTERVAL,
  OCPP_TEST_INTERVAL_MULTIPLIER: !parseInt(process.env.OCPP_TEST_INTERVAL) ? 1 : process.env.OCPP_TEST_INTERVAL,
  
  BYPASS_KLARNA: !parseInt(process.env.BYPASS_KLARNA) ? 0 : process.env.BYPASS_KLARNA
}
