// Normalizando o código, ajuda a evitar gambiarras
'use strict';

// Permite trabalhar com o sistema de arquivos do compuador
const fs = require('fs');
// Fornece utilitários para trabalhar com caminhos de arquivos e diretórios
const path = require('path');
/*Sequelize é um ORM para Node.js, que tem suporte para vários bancos de dados ORM mapeamento objeto-relacional. As tabelas do banco de dados são representadas em classes e os registros das tabelas seriam instâncias dessas classes.*/
const Sequelize = require('sequelize');
// Permite obter informações do processo na página atual
const process = require('process');
// Permite obter parte do caminho para o arquivo.
const basename = path.basename(__filename);
// Verificando se deve utilizar a variável global ou 'development'
const env = process.env.NODE_ENV || 'development';
// inclui o arquivo que possui a conexão com o banco de dados
const config = require(__dirname + '/../config/config.js')[env];
// Criando a constante com objeto vazio
const db = {};
// Criando a variável que recebe a conexão com o banco de dados
let sequelize;
// Verificando qual configuração de banco de dados você deseja usar
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // Usando as configurações do arquivo "config/config.js"
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Verificando a conexão com o banco de dados
sequelize.authenticate().then(() => {
  console.log("Conexão com o banco de dados realizado com sucesso!");
}).catch((error) =>{
  // Atenção!!! Retirar o trecho de código abaixo quando a aplicação for para produção.
  console.log("Error: Conexão não realizada!", error);
});

// Identificando a Model que será carregada
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Atribuindo a conexão com o banco de dados para o objeto db
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Exportando a instrução que está dentro da constante db
module.exports = db;
