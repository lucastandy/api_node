// Incluindo as bibliotecas
// Dependência que gerencia as requisições, rotas e URLs, entre outras funcionalidades
const express = require('express');

// Chamando a função express
const app = express();

// Criando a primeira rota
app.get("/", (req, res) => {
    res.send("Bem-vindo 2, Lucas Tandy!");
});

// Iniciando o servidor na porta 8090, criando a função utilizando o modelo Arrow function para retornar a mansagem de sucesso
app.listen(8090, () =>{
    console.log("Servidor iniciado na porta 8090: http://localhost:8090");
});



