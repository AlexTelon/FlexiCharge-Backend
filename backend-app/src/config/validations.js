const joi = require("joi");

const validationSchema = joi.object()
    .keys({
        PORT: joi.number(),
        USE_LOCAL_DATABASE: joi.number().required(),
        AWS_REGION: joi.string().required(),

        USER_POOL_SECRET: joi.string().required(),
        USER_POOL_ID: joi.string().required(),
        USER_POOL: joi.string().required(),

        ADMIN_POOL_SECRET: joi.string().required(),
        ADMIN_POOL_ID: joi.string().required(),
        ADMIN_POOL: joi.string().required(),

        RUN_OCPP_TEST: joi.number().required(),
        BYPASS_KLARNA: joi.number().required()
    }).unknown();

module.exports = validationSchema;
