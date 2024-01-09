// Incluindo as bibliotecas
// Dependência que gerencia as requisições, rotas e URLs, entre outras funcionalidades
const express = require('express');

// Chamando a função express
const app = express();

// Criando um middleware para receber os dados no corpo da requisição
app.use(express.json());

// Incluindo as Controllers
const users = require("./controllers/users");
const situations = require("./controllers/situations");

// Criando as rotas
app.use('/',users);
app.use('/',situations);

// Iniciando o servidor na porta 8090, criando a função utilizando o modelo Arrow function para retornar a mansagem de sucesso
app.listen(8090, () =>{
    console.log("Servidor iniciado na porta 8090: http://localhost:8090");
});



