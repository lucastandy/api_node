// Incluindo as bibliotecas
// Dependência que gerencia as requisições, rotas e URLs, entre outras funcionalidades
const express = require('express');

// Chamando a função express
const app = express();

// Criando um middleware para receber os dados no corpo da requisição
app.use(express.json());

// Realizando a inclusão da conexão com o banco de dados
require("./db/models"); // O node por padrão vai pegar o arquivo index.js, presente na pasta models.

// Incluindo as Controllers
const users = require("./controllers/users");

// Criando as rotas
app.use('/',users);

// Iniciando o servidor na porta 8090, criando a função utilizando o modelo Arrow function para retornar a mansagem de sucesso
app.listen(8090, () =>{
    console.log("Servidor iniciado na porta 8090: http://localhost:8090");
});



