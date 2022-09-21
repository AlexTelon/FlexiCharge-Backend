const joi = require("joi");

const validationSchema = joi.object()
    .keys({
        PORT: joi.number(),
        AWS_REGION: joi.string().required(),
        AWS_SECRET_HASH: joi.string().required(),
        AWS_CLIENT_ID: joi.string().required(),
        AWS_ADMIN_USER_POOL: joi.string().required(),
        AWS_USER_POOL: joi.string().required()
    }).unknown();

module.exports = validationSchema;
