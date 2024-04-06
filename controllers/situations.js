// Incluindo as bibliotecas
// Dependência que gerencia as requisições, rotas e URLs, entre outras funcionalidades
const express = require('express');

// Chamando a função express Router
const router = express.Router();

// Realizando a inclusão da conexão com o banco de dados
const db = require("../db/models"); // O node por padrão vai pegar o arquivo index.js, presente na pasta models.

// Incluindo o arquivo para validar o token
const {eAdmin} = require('../services/authService');

// Incluindo o arquivo responsável em salvar os logs
const logger = require('../services/loggerServices');

// Criando a rota listar
// Endereço para acessar a api através de aplicação externa: http://localhost:8090/situations?page=1
router.get("/situations", eAdmin, async (req, res) => {

    // Receber o número da página, quando não é enviado o número da página é atribuido página 1
    const { page = 1 } = req.query;

    // Limite de registros em cada página
    const limit = 40;

    // Variável com o número da última página
    var lastPage = 1;

    // Contar a quantidade de registro no banco de dados
    const countSituations = await db.Situations.count();

    // Acessa o IF quando encontrar registro no banco de dados
    if (countSituations !== 0) {

        // Calcular a última página
        lastPage = Math.ceil(countSituations / limit);

    } else {
        // Retornar objeto como resposta
        return res.status(400).json({
            error: true,
            message: "Erro: Nenhuma situação encontrada!"
        });
    }

    // Recuperar todas as situações do banco de dados
    const situations = await db.Situations.findAll({

        // Indicar quais colunas recuperar
        attributes: ['id', 'nameSituation'],

        // Ordenar os registros pela coluna id na forma decrescente
        order: [['nameSituation', 'ASC']],

        // Calcular a partir de qual registro deve retornar e o limite de registros
        offset: Number((page * limit) - limit),
        limit: limit
    });

    // Acessa o IF se encontrar o registro no banco de dados
    if (situations) {

        // Salvar o log no nível info
        logger.info({ message: "Listar situação.", userId: req.userId, date: new Date() });

        // Retornar objeto como resposta
        return res.json({
            error: false,
            situations
        });
    } else {

        // Salvar o log no nível info
        logger.info({ message: "Listar situação não executado corretamente.", userId: req.userId, date: new Date() });

        // Retornar objeto como resposta
        return res.status(400).json({
            error: true,
            message: "Erro: Nenhuma situação encontrada!"
        });
    }
});

// Criando a rota cadastrar
/*
A aplicação externa deve indicar que está enviando os dados em formato de objeto:
Content-Type: application/json
Dados em formato de objeto

{
    "nameSituation" : "Ativo"
}

*/
router.post("/situations", eAdmin,async (req, res) => {
    
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