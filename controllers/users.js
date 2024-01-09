// Incluindo as bibliotecas
// Dependência que gerencia as requisições, rotas e URLs, entre outras funcionalidades
const express = require('express');

// Chamando a função express Router
const router = express.Router();

// Realizando a inclusão da conexão com o banco de dados
const db = require("../db/models"); // O node por padrão vai pegar o arquivo index.js, presente na pasta models.

// Criando a rota listar
router.get("/", (req, res) => {
    // Retornando um texto como resposta
    res.send("Listar os usuários!");
});

// Criação da rota visualizar
router.get("/users/:id", (req, res) =>{
    
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

// Criando a rota cadastrar
/*
A aplicação externa deve indicar que está enviando os dados em formato de objeto:
Content-Type: application/json
Dados em formato de objeto

{
    "name" : "Lucas Tandy",
    "email": "lucastitandy@gmail.com",
    "situationId": 1
}

*/
router.post("/users", async (req, res) => {
    
    // Recebendo os dados enviados no corpo da requisição
    var data = req.body;

    // Salvando os dados no banco de dados
    await db.Users.create (data).then((dataUser) => {
        // Retornando um objeto como resposta
        return res.json({
            error: false,
            message: "Usuário cadastrado com sucesso!",
            dataUser
        });
    }).catch(() => {
        // Retornando um objeto como resposta
        return res.status(400).json({
            error: true,
            message: "Erro: usuário não cadastrado"
        });
    });

});

// Criando a rota editar
router.put("/users/:id", (req, res) =>{
    
    // Recebendo o parâmetro enviado na URL
    const {id} = req.params;

    // Recebendo os dados enviados no corpo da requisição
    const {_id, name, email, situationId} = req.body;

    // Retornando um objeto como resposta
    return res.json({id, _id, name, email, situationId});
});

// Criando a rota apagar
router.delete("/users/:id", (req, res) => {
    // Recebendo o parâmetro enviado na URL
    const {id} = req.params;
    
    // Retornando um objeto como resposta
    return res.json({id});

});

// Exportando a instrução que está dentro da constante router
module.exports = router;