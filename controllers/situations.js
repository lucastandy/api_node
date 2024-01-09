// Incluindo as bibliotecas
// Dependência que gerencia as requisições, rotas e URLs, entre outras funcionalidades
const express = require('express');

// Chamando a função express Router
const router = express.Router();

// Realizando a inclusão da conexão com o banco de dados
const db = require("../db/models"); // O node por padrão vai pegar o arquivo index.js, presente na pasta models.

// Criando a rota cadastrar
/*
A aplicação externa deve indicar que está enviando os dados em formato de objeto:
Content-Type: application/json
Dados em formato de objeto

{
    "nameSituation" : "Ativo"
}

*/
router.post("/situations", async (req, res) => {
    
    // Recebendo os dados enviados no corpo da requisição
    var data = req.body;

    // Salvando os dados no banco de dados
    await db.Situations.create(data).then((dataSituation) => {
        // Retornando um objeto como resposta
        return res.json({
            error: false,
            message: "Situação cadastrada com sucesso!",
            dataSituation
        });
    }).catch(() => {
        // Retornando um objeto como resposta
        return res.status(400).json({
            error: true,
            message: "Erro: situação não cadastrada"
        });

    });

    

});


// Exportando a instrução que está dentro da constante router
module.exports = router;