const joi = require("joi");

const validationSchema = joi.object()
    .keys({
        PORT: joi.number(),
    }).unknown();

module.exports = validationSchema;
