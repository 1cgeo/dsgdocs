"use strict";

const { db } = require("../database");

const controller = {};

controller.get = async () => {
  try {
    let data = await db.any(
      `
    SELECT id, nome FROM doc.categoria
    `
    );
    return { error: null, data: data };
  } catch (error) {
    const err = new Error("Error getting all categories");
    err.status = 500;
    err.context = "category_ctrl";
    err.information = { trace: error };
    return { error: err, data: null };
  }
};

controller.create = async nome => {
  try {
    await db.any(
      `
      INSERT INTO doc.categoria(nome) VALUES($1)
      `,
      [nome]
    );
    return { error: null };
  } catch (error) {
    const err = new Error("Error creating new category");
    err.status = 500;
    err.context = "category_ctrl";
    err.information = { nome, trace: error };
    return { error: err };
  }
};

controller.update = async (id, nome) => {
  try {
    let result = await db.result(
      `
      UPDATE doc.categoria SET nome =$1 WHERE id = $2
      `,
      [nome, id]
    );
    if (!result.rowCount || result.rowCount < 1) {
      let error = new Error("Category not found.");
      error.status = 404;
      error.context = "category_ctrl";
      error.information = { id, nome };
      throw error;
    }
    return { error: null };
  } catch (error) {
    if (error.message === "Category not found.") {
      return { error: error };
    } else {
      const err = new Error("Error updating category");
      err.status = 500;
      err.context = "category_ctrl";
      err.information = { id, nome, trace: error };
      return { error: err };
    }
  }
};

module.exports = controller;
