
const Joi = require('joi');

const headerAuthValidator = Joi.object({
    'authorization': Joi.string().required().description("pass token").error(new Error('header authorization is missing')),
    'lang': Joi.string().required().default("en").description("Language, Eg. en").example("en").error(new Error('header lang is missing')),
}).unknown()

const headerAuthNotRequired = Joi.object({
    'lang': Joi.string().required().default("en").description("Language, Eg. en").example("en").error(new Error('header lang is missing')),
}).unknown()

const faildAction = function faildAction(req, reply, source, error) {
    return reply({ message: error.output.payload.message }).code(error.output.statusCode);
}
module.exports = { headerAuthValidator, faildAction, headerAuthNotRequired };