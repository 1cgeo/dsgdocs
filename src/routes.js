"use strict";
const express = require("express");
const path = require("path");

const { loginRoute } = require("./login");

const { categoryRoute } = require("./categoria");
const { permissaoRoute } = require("./permissao");
const { userRoute } = require("./usuario");
const { arquivoRoute } = require("./arquivo");

const routes = app => {
  app.use("/login", loginRoute);

  //Serve HTTP Client
  app.use("/cliente", express.static(path.join(__dirname, "http_client")));

  app.use(
    "/armazenamento_arquivos",
    express.static(path.join(__dirname, "armazenamento_arquivos"))
  );

  app.use("/categorias", categoryRoute);
  app.use("/permissoes", permissaoRoute);
  app.use("/usuarios", userRoute);
  app.use("/arquivos", arquivoRoute);
};
module.exports = routes;
