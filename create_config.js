"use strict";

const fs = require("fs");
const inquirer = require("inquirer");
const chalk = require("chalk");
const pgtools = require("pgtools");
const path = require("path");
const bcrypt = require("bcryptjs");
const promise = require("bluebird");

const initOptions = {
  promiseLib: promise
};

const pgp = require("pg-promise")(initOptions);

const sql = fs.readFileSync(path.resolve("./er/dsgdocs.sql"), "utf-8").trim();

const createConfig = () => {
  console.log(chalk.blue("DSG Docs REST API"));
  console.log(chalk.blue("Criação do arquivo de configuração"));

  var questions = [
    {
      type: "input",
      name: "db_server",
      message: "Qual o endereço de IP do servidor do banco de dados PostgreSQL?"
    },
    {
      type: "input",
      name: "db_port",
      message: "Qual a porta do servidor do banco de dados PostgreSQL?",
      default: 5432
    },
    {
      type: "input",
      name: "db_user",
      message:
        "Qual o nome do usuário do PostgreSQL para interação com o DSGDocs (já existente no banco de dados e ter permissão para criação de bancos)?",
      default: "dsgdocs_app"
    },
    {
      type: "password",
      name: "db_password",
      message: "Qual a senha do usuário do PostgreSQL para interação DSGDocs?"
    },
    {
      type: "input",
      name: "db_name",
      message: "Qual o nome do banco de dados do DSGDocs?",
      default: "dsgdocs"
    },
    {
      type: "input",
      name: "port",
      message: "Qual a porta do serviço do DSGDocs?",
      default: 3015
    },
    {
      type: "input",
      name: "user",
      message:
        "Qual o nome do usuário para administração do DSGDocs (interno ao DSGDocs)?",
      default: "administrador"
    },
    {
      type: "password",
      name: "password",
      message: "Qual a senha do usuário para administração do DSGDocs?"
    },
    {
      type: "confirm",
      name: "db_create",
      message: "Deseja criar o banco de dados do DSGDocs?",
      default: true
    }
  ];

  inquirer.prompt(questions).then(async answers => {
    const config = {
      user: answers.db_user,
      password: answers.db_password,
      port: answers.db_port,
      host: answers.db_server
    };

    try {
      if (answers.db_create) {
        await pgtools.createdb(config, answers.db_name);

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

        console.log(
          chalk.blue("Banco de Dados do DSGDocs criado com sucesso!")
        );
      }
      let env = `PORT=${answers.port}
DB_SERVER=${answers.db_server}
DB_PORT=${answers.db_port}
DB_NAME=${answers.db_name}
DB_USER=${answers.db_user}
DB_PASSWORD=${answers.db_password}
JWT_SECRET=tassofragoso
`;

      let exists = fs.existsSync(".env");
      if (exists) {
        throw Error(".env já existe, delete antes de iniciar a configuração.");
      }
      fs.writeFileSync(".env", env);
      console.log(
        chalk.blue("Arquivo de configuração (.env) criado com sucesso!")
      );
    } catch (error) {
      if (
        error.message ===
        "Postgres error. Cause: permission denied to create database"
      ) {
        console.log(
          chalk.red(
            "O usuário informado não tem permissão para criar bancos de dados."
          )
        );
      } else if (
        error.message ===
        'Attempted to create a duplicate database. Cause: database "' +
          answers.db_name +
          '" already exists'
      ) {
        console.log(chalk.red("O banco " + answers.db_name + " já existe."));
      } else if (
        error.message ===
        'password authentication failed for user "' + answers.db_user + '"'
      ) {
        console.log(
          chalk.red("Senha inválida para o usuário " + answers.db_user)
        );
      } else if (
        error.message ===
        ".env já existe, delete antes de iniciar a configuração."
      ) {
        console.log(
          chalk.red(
            "Arquivo .env já existe, apague antes de iniciar a configuração."
          )
        );
        if (answers.db_create) {
          console.log(
            chalk.red(
              "Delete o banco de dados criado antes de executar a configuração novamente."
            )
          );
        }
      } else {
        console.log(error.message);
        console.log("-------------------------------------------------");
        console.log(error);
      }
    }
  });
};

createConfig();
