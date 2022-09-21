const dotenv = require("dotenv");
const path = require("path");
const validationSchema = require('./validations');

dotenv.config({path: path.join(__dirname, '../../.env')});

const {error} = validationSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) throw new Error(error);

module.exports = {
  PORT: !parseInt(process.env.PORT) ? 8080 : process.env.PORT
}
