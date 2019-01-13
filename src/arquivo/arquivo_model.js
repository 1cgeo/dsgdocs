"use strict";

const Joi = require("joi");

const workspaceVersion = Joi.object().keys({
  name: Joi.string().required(),
  description: Joi.string().required(),
  category_id: Joi.number()
    .integer()
    .required(),
  version_name: Joi.string().required(),
  version_author_id: Joi.number()
    .integer()
    .required(),
  version_date: Joi.date()
});

module.exports.workspaceVersion = workspaceVersion;
