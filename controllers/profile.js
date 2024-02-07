// Incluindo as bibliotecas
// Dependência que gerencia as requisições, rotas e URLs, entre outras funcionalidades
const express = require('express');
// Chamando a função express Router
const router = express.Router();
// Dependência para criptografar a senha
const bycrypt = require('bcryptjs');
// const { STRING } = require('sequelize');

// Dependência para validar os inputs o formulário
const yup = require('yup');
// Incluindo o arquivo responsável em salvar os logs
const logger = require('../services/loggerServices');
// Operador do sequelize. Para pegar dados de uma tabela secundária
const { Op } = require("sequelize");
// Realizando a inclusão da conexão com o banco de dados
const db = require("../db/models"); // O node por padrão vai pegar o arquivo index.js, presente na pasta models.
// Incluindo o arquivo para validar o token
const { eAdmin } = require('../services/authService');
// Incluindo o arquivo com a função de upload
const upload = require('../services/uploadImgUserServices');
// Incluindo o módulo fs que permite interagir com o sistema de arquivos
const fs = require('fs');

// Criação da rota visualizar
router.get("/profile", eAdmin, async (req, res) => {

    // Recuperando os registros do banco de dados
    const user = await db.Users.findOne({
        attributes: ['id', 'name', 'email', 'situationId', 'image', 'createdAt', 'updatedAt'],
        // Acrescentando condição para indicar qual registro deve ser retornado do banco de dados
        where: { id: req.userId },
        // Busca dados na tabela secudária
        include: [{
            model: db.Situations,
            attributes: ['nameSituation']
        }]
    });

    // Salvando o log no nível info
    logger.info({ message: "Perfil visualizado.", id: req.userId, userId: req.userId, date: new Date() });

    // Acessa o if se encontrar o registro no banco de dados
    if (user) {
        // Verificando se existe a imagem. Acessa o if quando o usuário possui a imagem.
        if (user.dataValues.image) {

            // Criando o caminho da imagem
            user.dataValues['image'] = process.env.URL_ADM + "/images/users/" + user.dataValues.image;
        } else {
            // Criando o caminho da imagem
            user.dataValues['image'] = process.env.URL_ADM + "/images/users/icon_user.png";
        }
        // Retornando um objeto como resposta
        return res.json({
            error: false,
            user
        });
    } else {
        // Salvando o log no nível info
        logger.info({ message: "Perfil não encontrado.", id: req.userId, userId: req.userId, date: new Date() });
        // Retornando um objeto como resposta
        return res.status(400).json({
            error: true,
            message: "Erro: perfil não encontrado!"
        });
    }

});

// Exportando a instrução que está dentro da constante router
module.exports = router;