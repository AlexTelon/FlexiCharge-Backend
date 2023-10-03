const joi = require("joi");

const validationSchema = joi.object()
    .keys({
        PORT: joi.number(),
        USE_LOCAL_DATABASE: joi.number().required(),
        AWS_REGION: joi.string().required(),

        USER_POOL_SECRET: joi.string().required(),
        USER_POOL_ID: joi.string().required(),
        USER_POOL: joi.string().required(),

        DATABASE_NAME: joi.string().required(),
        DATABASE_USERNAME: joi.string().required(),
        DATABASE_PASSWORD: joi.string().required(),
        DATABASE_HOST: joi.string().required(),

        KLARNA_TOKEN: joi.string().required(),

        RUN_OCPP_TEST: joi.number().required(),
        LIVEMETRICS_DB_UPDATE_INTERVAL: joi.number().required(),
        OCPP_TEST_INTERVAL_MULTIPLIER: joi.number().required(),
        BYPASS_KLARNA: joi.number().required()
    }).unknown();

module.exports = validationSchema;
