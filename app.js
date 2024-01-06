// Incluindo as bibliotecas
// Dependência que gerencia as requisições, rotas e URLs, entre outras funcionalidades
const express = require('express');

// Chamando a função express
const app = express();

// Criando a rota listar
app.get("/", (req, res) => {
    // Retornando um texto como resposta
    res.send("Bem-vindo 2, Lucas Tandy!");
});

// Criação da rota visualizar
app.get("/users/:id", (req, res) =>{
    
    // Usando a desestruturação para simplificar a atribuição do parâmetro
    const {id} = req.params; // Ex.: http://localhost:8090/users/1

    // Usando a desestruturação para simplificar a atribuição do parâmetro
    const {sit} = req.query; // Ex.: http://localhost:8090/users/1?sit=2

    return res.json({
        id,
        name: "Lucas",
        email: "lucastitandy@gmail.com",
        sit
    });
    // res.send(`Visualizar: ${id}`);
});

// Iniciando o servidor na porta 8090, criando a função utilizando o modelo Arrow function para retornar a mansagem de sucesso
app.listen(8090, () =>{
    console.log("Servidor iniciado na porta 8090: http://localhost:8090");
});



