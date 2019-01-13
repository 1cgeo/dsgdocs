"use strict";

const Joi = require("joi");

const category = Joi.object().keys({
  nome: Joi.string().required()
});

module.exports.category = category;
