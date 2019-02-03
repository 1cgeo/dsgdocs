"use strict";

const express = require("express");
const Joi = require("joi");

const { sendJsonAndLog } = require("../logger");

const { loginMiddleware } = require("../login");

const categoryCtrl = require("./category_ctrl");
const categoryModel = require("./category_model");

const router = express.Router();

router.get("/", loginMiddleware, async (req, res, next) => {
  let { error, data } = await categoryCtrl.get();
  if (error) {
    return next(error);
  }

  return sendJsonAndLog(
    true,
    "Categories returned",
    "category_route",
    null,
    res,
    200,
    data
  );
});

router.post("/", loginMiddleware, async (req, res, next) => {
  let validationResult = Joi.validate(req.body, categoryModel.category, {
    stripUnknown: true
  });
  if (validationResult.error) {
    const err = new Error("Create category validation error");
    err.status = 400;
    err.context = "category_route";
    err.information = { body: req.body, trace: validationResult.error };
    return next(err);
  }

  let { error } = await categoryCtrl.create(req.body.nome);
  if (error) {
    return next(error);
  }

  return sendJsonAndLog(
    true,
    "Category created",
    "category_route",
    {
      body: req.body
    },
    res,
    201,
    null
  );
});

router.put("/:id", loginMiddleware, async (req, res, next) => {
  let validationResult = Joi.validate(req.body, categoryModel.category, {
    stripUnknown: true
  });
  if (validationResult.error) {
    const err = new Error("Update category validation error");
    err.status = 400;
    err.context = "category_route";
    err.information = {
      id: req.params.id,
      body: req.body,
      trace: validationResult.error
    };
    return next(err);
  }

  let { error } = await categoryCtrl.update(req.params.id, req.body.nome);
  if (error) {
    return next(error);
  }

  return sendJsonAndLog(
    true,
    "Category updated",
    "category_route",
    {
      id: req.params.id,
      body: req.body
    },
    res,
    200,
    null
  );
});

module.exports = router;
