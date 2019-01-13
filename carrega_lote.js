"use strict";

const inquirer = require("inquirer");
const chalk = require("chalk");
const promise = require("bluebird");

const initOptions = {
  promiseLib: promise
};

const pgp = require("pg-promise")(initOptions);

require("dotenv").config();

const carregaLote = () => {
  console.log(chalk.blue("Carregamento em Lote para o DSGDocs"));

  var questions = [
    {
      type: "input",
      name: "folder",
      message: "Qual a pasta que contém os arquivos a serem carregados?"
    },
    {
      type: "input",
      name: "metadata",
      message: "Qual o arquivo CSV que contém os metadados?"
    }
  ];

  inquirer.prompt(questions).then(async answers => {
    try {
      const connectionString =
        "postgres://" +
        answers.db_user +
        ":" +
        answers.db_password +
        "@" +
        answers.db_server +
        ":" +
        answers.db_port +
        "/" +
        answers.db_name;

      const db = pgp(connectionString);

      await db.none(sql);

      await db.none(
        `
        GRANT ALL ON SCHEMA doc TO $1:name;
        GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA doc TO $1:name;
        GRANT ALL ON ALL SEQUENCES IN SCHEMA doc TO $1:name;
        `,
        [answers.db_user]
      );

      let hash = await bcrypt.hash(answers.password, 10);
      await db.none(
        `
          INSERT INTO doc.usuario (nome, login, senha) VALUES
          ($1, $1, $2)
        `,
        [answers.user, hash]
      );

      console.log(chalk.blue("Arquivos carregados com sucesso!"));
    } catch (error) {
      console.log(error.message);
      console.log("-------------------------------------------------");
      console.log(error);
    }
  });
};

carregaLote();
