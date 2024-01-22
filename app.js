// Incluindo as bibliotecas
// Dependência que gerencia as requisições, rotas e URLs, entre outras funcionalidades
const express = require('express');

// Importando a biblioteca para permitir conexão externa
const cors = require('cors');

// Chamando a função express
const app = express();

// Criando um middleware para receber os dados no corpo da requisição
app.use(express.json());

// Criando o middleware para permitir requisição externa
app.use((req, res, next) => {
    // O "*" indica que qualquer endereço pode fazer requisição.
    res.header("Access-Control-Allow-Origin","*");
    // Indicando quais tipos de método que a API aceita
    res.header("Access-Control-Allow-Methods","GET, PUT, POST, DELETE");
    // Permitindo o envio de dados para API
    res.header("Access-Control-Allow-Headers","Content-Type, Authorization");
    // Executando o cors
    app.use(cors());
    // Quando não houver erro, deve continuar o processamento
    next();

});

// Incluindo as Controllers
const users = require("./controllers/users");
const situations = require("./controllers/situations");
const login = require("./controllers/login");

// Criando as rotas
app.use('/',users);
app.use('/',situations);
app.use('/',login);

// Iniciando o servidor na porta 8090, criando a função utilizando o modelo Arrow function para retornar a mansagem de sucesso
app.listen(8090, () =>{
    console.log("Servidor iniciado na porta 8090: http://localhost:8090");
});



